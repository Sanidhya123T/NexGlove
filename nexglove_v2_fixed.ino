// ============================================================
// NexGlove - Bluetooth HID Mouse Firmware
// ESP32 DevKit V1 + MPU6050 + 4 Buttons
// ============================================================

#include <Wire.h>
#include <BleMouse.h>

// =========================
// USER CONFIGURATION
// =========================

// --- I2C / MPU6050 ---
#define MPU_ADDR         0x68
#define PWR_MGMT_1_REG   0x6B
#define GYRO_CONFIG_REG  0x1B
#define GYRO_XOUT_H_REG  0x43
#define SDA_PIN          21
#define SCL_PIN          22
#define GYRO_SENSITIVITY 131.0f   // LSB per (deg/s) at +-250 deg/s range

// --- Buttons ---
#define BUTTON_LEFT      32   // Left click
#define BUTTON_RIGHT     33   // Right click
#define BUTTON_SCROLL    25   // Hold to activate scroll mode
#define BUTTON_LOCK      26   // Toggle motion lock
#define DEBOUNCE_MS      25

// --- Motion tuning (starting points - tune experimentally) ---
const float CURSOR_DEADZONE_DPS   = 2.0f;    // deg/s below this is ignored (kills idle jitter)
const float CURSOR_SENSITIVITY    = 50.0f;    // pixels per (deg/s * second) - raised for more sensitivity
const float CURSOR_SMOOTHING      = 0.35f;   // exponential smoothing factor (0-1, higher = snappier/less smooth)
const int   CURSOR_MAX_PER_REPORT = 20;      // clamp per-report movement to avoid sudden jumps

const float SCROLL_DEADZONE_DPS   = 3.0f;
const float SCROLL_SENSITIVITY    = 0.50f;
const float SCROLL_SMOOTHING      = 0.35f;
const unsigned long SCROLL_REPORT_INTERVAL_MS = 60; // limits scroll event rate

const unsigned long SAMPLE_INTERVAL_MS = 10; // ~100Hz motion sampling

// --- Drift correction: slowly re-zero bias whenever the glove is genuinely still ---
const float STATIONARY_THRESHOLD_DPS = 3.0f;   // all axes must be under this to count as "still"
const unsigned long STATIONARY_HOLD_MS = 500;  // must be still this long before correcting
const float BIAS_ADAPT_ALPHA = 0.002f;         // how fast bias nudges toward the still reading (slow on purpose)

// Set to 1 temporarily to print filtered rates to Serial - use this to find out which
// physical axis is yaw/pitch/roll on YOUR glove before trusting the mapping below.
#define DEBUG_PRINT_RATES 0

// =========================
// STATE
// =========================
BleMouse bleMouse("NexGlove", "NexGlove Project", 100);

float gyroBiasX = 0, gyroBiasY = 0, gyroBiasZ = 0;
float filteredX = 0, filteredY = 0, filteredZ = 0;

float cursorRemX = 0, cursorRemY = 0;   // fractional-pixel accumulators
float scrollRemainder = 0;

unsigned long lastSampleTime = 0;
unsigned long lastScrollReport = 0;
unsigned long stationarySince = 0;

bool motionLocked = false;

struct Button {
  uint8_t pin;
  bool lastReading;
  bool stableState;
  unsigned long lastChangeTime;
};

Button btnLeft   = {BUTTON_LEFT,   HIGH, HIGH, 0};
Button btnRight  = {BUTTON_RIGHT,  HIGH, HIGH, 0};
Button btnScroll = {BUTTON_SCROLL, HIGH, HIGH, 0};
Button btnLock   = {BUTTON_LOCK,   HIGH, HIGH, 0};

// =========================
// SETUP
// =========================
void setup() {
  Serial.begin(115200);
  delay(300);

  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(400000);

  initMPU6050();
  calibrateGyro();

  pinMode(BUTTON_LEFT, INPUT_PULLUP);
  pinMode(BUTTON_RIGHT, INPUT_PULLUP);
  pinMode(BUTTON_SCROLL, INPUT_PULLUP);
  pinMode(BUTTON_LOCK, INPUT_PULLUP);

  bleMouse.begin();

  Serial.println("NexGlove ready. Waiting for Bluetooth connection...");
}

// =========================
// MAIN LOOP
// =========================
void loop() {
  updateButtons();

  if (bleMouse.isConnected()) {
    handleLeftClick();
    handleRightClick();
    handleMotionLockToggle();

    if (millis() - lastSampleTime >= SAMPLE_INTERVAL_MS) {
      float dt = (millis() - lastSampleTime) / 1000.0f;
      lastSampleTime = millis();
      processMotion(dt);
    }
  }
}

// =========================
// MPU6050
// =========================
void initMPU6050() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(PWR_MGMT_1_REG);
  Wire.write(0x00);          // wake up
  Wire.endTransmission(true);

  Wire.beginTransmission(MPU_ADDR);
  Wire.write(GYRO_CONFIG_REG);
  Wire.write(0x00);          // +-250 deg/s range
  Wire.endTransmission(true);

  delay(100);
}

void readGyroRaw(int16_t &gx, int16_t &gy, int16_t &gz) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(GYRO_XOUT_H_REG);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6);

  gx = (Wire.read() << 8) | Wire.read();
  gy = (Wire.read() << 8) | Wire.read();
  gz = (Wire.read() << 8) | Wire.read();
}

void calibrateGyro() {
  Serial.println("Calibrating gyro - keep the glove still...");
  const int samples = 300;
  long sumX = 0, sumY = 0, sumZ = 0;

  for (int i = 0; i < samples; i++) {
    int16_t gx, gy, gz;
    readGyroRaw(gx, gy, gz);
    sumX += gx;
    sumY += gy;
    sumZ += gz;
    delay(3);
  }

  gyroBiasX = sumX / (float)samples;
  gyroBiasY = sumY / (float)samples;
  gyroBiasZ = sumZ / (float)samples;

  Serial.println("Calibration complete.");
}

// =========================
// MOTION PROCESSING
// =========================
void processMotion(float dt) {
  int16_t gx, gy, gz;
  readGyroRaw(gx, gy, gz);

  // Bias removal + convert to deg/s
  float rateX = (gx - gyroBiasX) / GYRO_SENSITIVITY;
  float rateY = (gy - gyroBiasY) / GYRO_SENSITIVITY;
  float rateZ = (gz - gyroBiasZ) / GYRO_SENSITIVITY;

  updateBiasIfStationary(rateX, rateY, rateZ, gx, gy, gz);

  // Low-pass (exponential smoothing) filter
  filteredX += CURSOR_SMOOTHING * (rateX - filteredX);
  filteredY += CURSOR_SMOOTHING * (rateY - filteredY);
  filteredZ += SCROLL_SMOOTHING * (rateZ - filteredZ);

#if DEBUG_PRINT_RATES
  Serial.printf("X:%6.1f  Y:%6.1f  Z:%6.1f\n", filteredX, filteredY, filteredZ);
#endif

  bool scrollMode = (btnScroll.stableState == LOW);

  if (scrollMode) {
    handleScroll(-filteredY, dt);
  } else if (!motionLocked) {
    // A gyro senses rotation, not translation - true hand-sideways movement can't be
    // measured without drift-prone accel double-integration, so we use wrist rotation
    // instead (same approach every "air mouse" pointer device uses):
    //   yaw (Z)   -> left/right cursor movement (twisting the wrist)
    //   pitch (Y) -> up/down cursor movement (tilting the wrist)
    // Verify this matches YOUR glove's mounting orientation using DEBUG_PRINT_RATES above -
    // if it's backwards, swap which variable goes into the first argument below.
    handleCursorMove(-filteredZ, filteredY, dt);
  }
}

// Whenever the glove has been genuinely still for a while, slowly nudge the bias
// toward the current raw reading. This cancels slow gyro drift (temperature, etc.)
// without affecting responsiveness while the hand is actually moving.
void updateBiasIfStationary(float rateX, float rateY, float rateZ, int16_t gx, int16_t gy, int16_t gz) {
  bool stillNow = (fabs(rateX) < STATIONARY_THRESHOLD_DPS) &&
                  (fabs(rateY) < STATIONARY_THRESHOLD_DPS) &&
                  (fabs(rateZ) < STATIONARY_THRESHOLD_DPS);

  if (stillNow) {
    if (stationarySince == 0) stationarySince = millis();
    if (millis() - stationarySince > STATIONARY_HOLD_MS) {
      gyroBiasX += BIAS_ADAPT_ALPHA * (gx - gyroBiasX);
      gyroBiasY += BIAS_ADAPT_ALPHA * (gy - gyroBiasY);
      gyroBiasZ += BIAS_ADAPT_ALPHA * (gz - gyroBiasZ);
    }
  } else {
    stationarySince = 0;
  }
}

void handleCursorMove(float rateHoriz, float rateVert, float dt) {
  float dx = applyDeadzone(rateHoriz, CURSOR_DEADZONE_DPS);
  float dy = applyDeadzone(rateVert, CURSOR_DEADZONE_DPS);

  cursorRemX += dx * CURSOR_SENSITIVITY * dt;
  cursorRemY += dy * CURSOR_SENSITIVITY * dt;

  int moveX = (int)cursorRemX;
  int moveY = (int)cursorRemY;
  cursorRemX -= moveX;
  cursorRemY -= moveY;

  moveX = constrain(moveX, -CURSOR_MAX_PER_REPORT, CURSOR_MAX_PER_REPORT);
  moveY = constrain(moveY, -CURSOR_MAX_PER_REPORT, CURSOR_MAX_PER_REPORT);

  if (moveX != 0 || moveY != 0) {
    // If a direction feels inverted for your glove orientation, negate it here
    // (e.g. bleMouse.move(-moveX, moveY, 0) to flip left/right)
    bleMouse.move(moveX, moveY, 0);
  }
}

void handleScroll(float rateZ, float dt) {
  float dz = applyDeadzone(rateZ, SCROLL_DEADZONE_DPS);
  scrollRemainder += dz * SCROLL_SENSITIVITY * dt;

  if (millis() - lastScrollReport < SCROLL_REPORT_INTERVAL_MS) return;

  int scrollAmount = (int)scrollRemainder;
  if (scrollAmount != 0) {
    scrollRemainder -= scrollAmount;
    scrollAmount = constrain(scrollAmount, -3, 3);
    bleMouse.move(0, 0, scrollAmount);
    lastScrollReport = millis();
  }
}

float applyDeadzone(float value, float threshold) {
  if (fabs(value) < threshold) return 0.0f;
  return (value > 0) ? (value - threshold) : (value + threshold);
}

// =========================
// BUTTONS
// =========================
void updateButtons() {
  updateOne(btnLeft);
  updateOne(btnRight);
  updateOne(btnScroll);
  updateOne(btnLock);
}

void updateOne(Button &b) {
  bool reading = digitalRead(b.pin);
  if (reading != b.lastReading) {
    b.lastChangeTime = millis();
  }
  if ((millis() - b.lastChangeTime) > DEBOUNCE_MS) {
    b.stableState = reading;
  }
  b.lastReading = reading;
}

void handleLeftClick() {
  static bool wasPressed = false;
  bool pressed = (btnLeft.stableState == LOW);
  if (pressed && !wasPressed) bleMouse.press(MOUSE_LEFT);
  if (!pressed && wasPressed) bleMouse.release(MOUSE_LEFT);
  wasPressed = pressed;
}

void handleRightClick() {
  static bool wasPressed = false;
  bool pressed = (btnRight.stableState == LOW);
  if (pressed && !wasPressed) bleMouse.press(MOUSE_RIGHT);
  if (!pressed && wasPressed) bleMouse.release(MOUSE_RIGHT);
  wasPressed = pressed;
}

void handleMotionLockToggle() {
  static bool wasPressed = false;
  bool pressed = (btnLock.stableState == LOW);
  if (pressed && !wasPressed) {
    motionLocked = !motionLocked;
    Serial.println(motionLocked ? "Motion LOCKED" : "Motion UNLOCKED");
  }
  wasPressed = pressed;
}
