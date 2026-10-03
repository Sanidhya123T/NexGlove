# System Architecture

NexGlove follows a layered technical approach.

## 1. Input Layer

Captures:

- Hand movement
- Hand orientation
- Button inputs

**Hardware:** MPU6050, INMP441 and four physical buttons.

## 2. Processing Layer

- Processes sensor inputs.
- Filters motion data.
- Uses AI-based gesture recognition.
- Interprets hand movements.
- Triggers intelligent commands.

## 3. Communication Layer

- Provides stable, low-latency wireless communication.
- Transmits standard Bluetooth HID commands to the computer.

## 4. Output Layer

Provides:

- Wireless cursor control
- Clicking
- Scrolling
- Media controls
- Keyboard functions

NexGlove works as a Bluetooth HID device for computer interaction.
