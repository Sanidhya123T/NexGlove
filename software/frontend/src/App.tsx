import { useState, useRef } from 'react';
import logoUrl from './imports/image-1.png';

// ── Brand palette ─────────────────────────────────────────────────────────────
// Deep navy (primary) · Bright NexGlove blue (accent) · White (secondary)

const NAVY = '#0f2748';
const BLUE = '#2563eb';

// ── Types & Constants ────────────────────────────────────────────────────────

interface Control {
  id: string;
  operation: string;
  text?: string;
  buttons: string[];
}

// NexGlove has EXACTLY FOUR glove buttons.
const ALL_BUTTONS = ['B1', 'B2', 'B3', 'B4'];

const DEFAULT_FUNCTIONS = [
  { id: 'B1', label: 'Left Click' },
  { id: 'B2', label: 'Right Click' },
  { id: 'B3', label: 'Scroll' },
  { id: 'B4', label: 'Gyroscope ON/OFF' },
];

const GESTURE_FUNCTIONS = [
  { icon: 'vol-up',    label: 'Volume Up',   desc: 'Raise hand' },
  { icon: 'vol-down',  label: 'Volume Down', desc: 'Lower hand' },
  { icon: 'swipe-left',  label: 'Swipe Left',  desc: 'Previous' },
  { icon: 'swipe-right', label: 'Swipe Right', desc: 'Next' },
];

const PREDEFINED_ACTIONS = [
  'Copy', 'Paste', 'Cut', 'Undo', 'Redo',
  'Select All', 'Save', 'Alt + Tab', 'Ctrl + Shift + Esc', 'Type Text',
];

const KEYBOARD_SHORTCUTS: Record<string, string> = {
  'Copy':               'Ctrl + C',
  'Paste':              'Ctrl + V',
  'Cut':                'Ctrl + X',
  'Undo':               'Ctrl + Z',
  'Redo':               'Ctrl + Y',
  'Select All':         'Ctrl + A',
  'Save':               'Ctrl + S',
  'Alt + Tab':          'Alt + Tab',
  'Ctrl + Shift + Esc': 'Ctrl + Shift + Esc',
};

const getActionType = (op: string) =>
  op === 'Type Text' ? 'Text Input' : 'Keyboard Shortcut';

const genId = () => Math.random().toString(36).slice(2, 8);

const findControl = (pressed: string[], controls: Control[]): Control | null => {
  if (!pressed.length) return null;
  const key = [...pressed].sort().join(',');
  return controls.find(c => [...c.buttons].sort().join(',') === key) ?? null;
};

// ── Initial Data (four-button combinations only) ───────────────────────────────

const INITIAL_CONTROLS: Control[] = [
  { id: '1', operation: 'Copy',       buttons: ['B1', 'B2'] },
  { id: '2', operation: 'Paste',      buttons: ['B2', 'B3'] },
  { id: '3', operation: 'Cut',        buttons: ['B1', 'B3'] },
  { id: '4', operation: 'Select All', buttons: ['B1', 'B4'] },
  { id: '5', operation: 'Undo',       buttons: ['B2', 'B4'] },
  { id: '6', operation: 'Redo',       buttons: ['B3', 'B4'] },
  { id: '7', operation: 'Save',       buttons: ['B1', 'B2', 'B3'] },
  { id: '8', operation: 'Type Text',  buttons: ['B1', 'B2', 'B4'], text: 'Hello Omkar' },
];

// ── Edit / Add Modal ──────────────────────────────────────────────────────────

function EditModal({
  control,
  controls,
  btns,
  setBtns,
  onSave,
  onClose,
}: {
  control: Control | null;
  controls: Control[];
  btns: string[];
  setBtns: (b: string[]) => void;
  onSave: (op: string, buttons: string[], text?: string) => void;
  onClose: () => void;
}) {
  const [op, setOp] = useState(control?.operation ?? '');
  const [text, setText] = useState(control?.text ?? '');
  const [dropOpen, setDropOpen] = useState(false);

  const isTypeText = op === 'Type Text';
  const actionType = op ? getActionType(op) : null;
  const shortcut = op ? KEYBOARD_SHORTCUTS[op] : null;

  const isDuplicate = btns.length > 0 && controls.some(c => {
    if (control && c.id === control.id) return false;
    return [...c.buttons].sort().join(',') === [...btns].sort().join(',');
  });

  const canSave =
    op.length > 0 &&
    btns.length > 0 &&
    (!isTypeText || text.trim().length > 0) &&
    !isDuplicate;

  const toggleBtn = (b: string) =>
    setBtns(btns.includes(b) ? btns.filter(x => x !== b) : [...btns, b]);

  const handleSave = () => {
    if (!canSave) return;
    onSave(op, btns, isTypeText ? text.trim() : undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(15,39,72,0.28)' }}
      onClick={onClose}
    >
      <div
        className="w-[400px] bg-white rounded-2xl border border-slate-200 shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: NAVY }}>
            {control ? 'Edit Control' : 'Add New Control'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Operation / Action — custom dropdown */}
        <div className="mb-4">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
            Operation / Action
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropOpen(d => !d)}
              className={`w-full flex items-center justify-between border rounded-lg px-3 py-2.5 text-sm text-left transition-colors focus:outline-none ${
                op ? 'text-slate-900' : 'text-slate-400'
              } ${dropOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span>{op || 'Select an action'}</span>
              <svg
                width="11" height="7" viewBox="0 0 11 7" fill="none"
                className={`transition-transform duration-150 ${dropOpen ? 'rotate-180' : ''}`}
              >
                <path d="M1 1L5.5 6L10 1" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden py-1 max-h-64 overflow-y-auto">
                  {PREDEFINED_ACTIONS.map(action => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => { setOp(action); setDropOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        op === action
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Type — read-only, auto-determined */}
        {actionType && (
          <div className="mb-4">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
              Action Type
            </label>
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-slate-700 border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 font-medium">
                {actionType}
              </span>
              {shortcut && (
                <span className="text-xs text-slate-400 font-mono">{shortcut}</span>
              )}
            </div>
          </div>
        )}

        {/* Text field — only for Type Text */}
        {isTypeText && (
          <div className="mb-4">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
              Text
            </label>
            <input
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. Hello Omkar"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>
        )}

        {/* Button Combination */}
        <div className="mb-1">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">
            Button Combination
          </label>
          <div className="flex gap-2">
            {ALL_BUTTONS.map(b => (
              <button
                key={b}
                type="button"
                onClick={() => toggleBtn(b)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  btns.includes(b)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {btns.length > 0
              ? `Selected: ${[...btns].sort().join(' + ')}`
              : 'Tap buttons here or directly on the glove.'}
          </p>
        </div>

        {/* Duplicate warning */}
        {isDuplicate && (
          <p className="text-[11px] text-amber-600 mt-1">
            This button combination is already assigned.
          </p>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Combo Pills ───────────────────────────────────────────────────────────────

function ComboPills({ buttons }: { buttons: string[] }) {
  const sorted = [...buttons].sort();
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {sorted.flatMap((btn, i) => [
        i > 0 ? (
          <span key={`sep-${i}`} className="text-slate-300 text-xs font-medium">+</span>
        ) : null,
        <span
          key={btn}
          className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-1.5 py-0.5 rounded"
        >
          {btn}
        </span>,
      ])}
    </div>
  );
}

// ── Glove Palm SVG (right hand, palm to viewer, thumb on the right) ─────────────
//
// Button locations are physical:
//   B1 → under the little finger
//   B2 → under the ring finger
//   B3 → under the middle finger
//   B4 → between the index finger and the thumb

const BUTTON_DEFS = [
  { id: 'B1', cx: 88,  cy: 214 }, // little finger
  { id: 'B2', cx: 134, cy: 202 }, // ring finger
  { id: 'B3', cx: 181, cy: 206 }, // middle finger
  { id: 'B4', cx: 250, cy: 230 }, // between index & thumb
];

function GlovePalm({
  pressed,
  state,
  onPress,
}: {
  pressed: string[];
  state: 'idle' | 'valid' | 'invalid';
  onPress: (b: string) => void;
}) {
  const D = '#122c52'; // deep navy glove body
  const M = '#1b3d6e'; // mid navy panel
  const S = '#3a5c93'; // seam / crease lines

  return (
    <svg
      viewBox="0 0 340 460"
      fill="none"
      className="w-full h-full select-none"
      overflow="visible"
    >
      {/* ── Wrist cuff ── */}
      <rect x="96" y="390" width="150" height="66" rx="12" fill={M} />
      <rect x="96" y="390" width="150" height="14" rx="7" fill={S} opacity="0.5" />

      {/* ── Palm body ── */}
      <rect x="58" y="176" width="214" height="226" rx="18" fill={D} />
      <rect x="63" y="176" width="204" height="22" rx="9" fill={M} />

      {/* ── Little finger ── */}
      <rect x="68" y="96" width="38" height="112" rx="15" fill={D} />
      <rect x="72" y="132" width="30" height="1.5" rx="1" fill={S} opacity="0.7" />
      <rect x="72" y="168" width="30" height="1.5" rx="1" fill={S} opacity="0.7" />

      {/* ── Ring finger ── */}
      <rect x="114" y="56" width="40" height="150" rx="15" fill={D} />
      <rect x="118" y="100" width="32" height="1.5" rx="1" fill={S} opacity="0.7" />
      <rect x="118" y="150" width="32" height="1.5" rx="1" fill={S} opacity="0.7" />

      {/* ── Middle finger ── */}
      <rect x="161" y="42" width="40" height="164" rx="15" fill={D} />
      <rect x="165" y="90"  width="32" height="1.5" rx="1" fill={S} opacity="0.7" />
      <rect x="165" y="142" width="32" height="1.5" rx="1" fill={S} opacity="0.7" />

      {/* ── Index finger ── */}
      <rect x="208" y="62" width="40" height="146" rx="15" fill={D} />
      <rect x="212" y="106" width="32" height="1.5" rx="1" fill={S} opacity="0.7" />
      <rect x="212" y="156" width="32" height="1.5" rx="1" fill={S} opacity="0.7" />

      {/* ── Thumb (right side) ── */}
      <path
        d="M 266 250 C 288 232 312 224 324 236 C 334 246 328 268 310 280 C 294 290 276 296 266 290 Z"
        fill={D}
      />
      <path
        d="M 288 246 Q 300 240 312 246 Q 320 250 322 260"
        stroke={S} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"
      />

      {/* ── Palm crease lines ── */}
      <path
        d="M 96 292 Q 132 312 168 305 Q 200 298 224 286"
        stroke={M} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9"
      />
      <path
        d="M 92 338 Q 130 358 166 351 Q 196 344 220 330"
        stroke={M} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"
      />

      {/* ── Buttons ── */}
      {BUTTON_DEFS.map(({ id, cx, cy }) => {
        const isPressed = pressed.includes(id);
        const isRed   = isPressed && state === 'invalid';
        const isOn    = isPressed && state !== 'invalid';
        const activeColor = isRed ? '#ef4444' : BLUE;

        return (
          <g
            key={id}
            onClick={() => onPress(id)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label={`Glove button ${id}`}
          >
            <circle cx={cx} cy={cy} r={24} fill="transparent" />

            {isPressed && (
              <circle
                cx={cx} cy={cy} r={24}
                fill={`${activeColor}26`}
                style={isRed ? { animation: 'blinkRed 0.35s ease-in-out 3' } : undefined}
              />
            )}

            <circle
              cx={cx} cy={cy} r={17}
              fill={isPressed ? activeColor : '#20396b'}
              stroke={isPressed ? activeColor : '#4f6ea6'}
              strokeWidth={isOn ? 2.5 : 2}
              style={isRed ? { animation: 'blinkRed 0.35s ease-in-out 3' } : undefined}
            />

            <text
              x={cx} y={cy + 3.5}
              textAnchor="middle"
              fontSize="10.5"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="700"
              fill={isPressed ? '#ffffff' : '#c7d6f0'}
              letterSpacing="0.03em"
            >
              {id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconEdit() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function DefaultIcon({ id }: { id: string }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as 'round',
    strokeLinejoin: 'round' as 'round',
  };
  if (id === 'B1') {
    return (
      <svg {...common}>
        <rect x="6" y="3" width="12" height="18" rx="6" />
        <path d="M6 9h6V3" fill="currentColor" stroke="none" opacity="0.9" />
        <path d="M12 9v3" />
      </svg>
    );
  }
  if (id === 'B2') {
    return (
      <svg {...common}>
        <rect x="6" y="3" width="12" height="18" rx="6" />
        <path d="M18 9h-6V3" fill="currentColor" stroke="none" opacity="0.9" />
        <path d="M12 9v3" />
      </svg>
    );
  }
  if (id === 'B3') {
    return (
      <svg {...common}>
        <rect x="6" y="3" width="12" height="18" rx="6" />
        <line x1="12" y1="7" x2="12" y2="11" />
        <path d="M10 5.5l2-1.5 2 1.5M10 12.5l2 1.5 2-1.5" />
      </svg>
    );
  }
  if (id === 'B4') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="3.5" ry="9" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return null;
}

function GestureIcon({ id }: { id: string }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as 'round',
    strokeLinejoin: 'round' as 'round',
  };
  if (id === 'vol-up') {
    return (
      <svg {...common}>
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        <path d="M17 8v8M21 6v12" />
      </svg>
    );
  }
  if (id === 'vol-down') {
    return (
      <svg {...common}>
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        <path d="M17 10v4" />
      </svg>
    );
  }
  if (id === 'swipe-left') {
    return (
      <svg {...common}>
        <path d="M20 12H5" />
        <path d="M11 6l-6 6 6 6" />
      </svg>
    );
  }
  if (id === 'swipe-right') {
    return (
      <svg {...common}>
        <path d="M4 12h15" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    );
  }
  return null;
}

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill={NAVY} />
      {/* compact glove silhouette */}
      <g fill="#ffffff">
        <rect x="9"  y="10" width="3" height="9"  rx="1.5" />
        <rect x="13.5" y="8"  width="3" height="11" rx="1.5" />
        <rect x="18" y="9"  width="3" height="10" rx="1.5" />
        <rect x="8.5" y="16" width="13" height="8" rx="3" />
      </g>
      <path d="M21.5 18.5 C 24 17 26 17 26.5 18.5 C 27 20 25.5 21.5 23 22"
        fill="#ffffff" />
      <circle cx="11" cy="20" r="1.4" fill={BLUE} />
      <circle cx="15" cy="19.5" r="1.4" fill={BLUE} />
      <circle cx="19" cy="20" r="1.4" fill={BLUE} />
    </svg>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [controls, setControls] = useState<Control[]>(INITIAL_CONTROLS);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<Control | null>(null);

  // Button selection lifted so the palm can sync with the open modal
  const [modalBtns, setModalBtns] = useState<string[]>([]);

  // Palm combination-testing state (used only when no modal is open)
  const [pressed,    setPressed]    = useState<string[]>([]);
  const [gloveState, setGloveState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setModalBtns([]);
    setModalOpen(true);
  };

  const openEdit = (c: Control) => {
    setEditTarget(c);
    setModalBtns([...c.buttons]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setModalBtns([]);
  };

  const saveControl = (op: string, buttons: string[], text?: string) => {
    const entry: Control = { id: editTarget?.id ?? genId(), operation: op, buttons };
    if (text) entry.text = text;

    if (editTarget) {
      setControls(prev => prev.map(c => c.id === editTarget.id ? entry : c));
    } else {
      setControls(prev => [...prev, entry]);
    }
    closeModal();
  };

  const deleteControl = (id: string) => setControls(prev => prev.filter(c => c.id !== id));

  // Palm button press: routes to modal selection when modal is open,
  // otherwise runs the combination-testing flow.
  const handlePress = (btn: string) => {
    if (modalOpen) {
      setModalBtns(prev =>
        prev.includes(btn) ? prev.filter(b => b !== btn) : [...prev, btn]
      );
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (resetRef.current) clearTimeout(resetRef.current);

    const newPressed = pressed.includes(btn)
      ? pressed.filter(b => b !== btn)
      : [...pressed, btn];

    setPressed(newPressed);
    setGloveState('idle');

    if (!newPressed.length) return;

    timerRef.current = setTimeout(() => {
      const match = findControl(newPressed, controls);
      setGloveState(match ? 'valid' : 'invalid');
      resetRef.current = setTimeout(() => { setPressed([]); setGloveState('idle'); }, 1200);
    }, 1200);
  };

  const matchedControl = gloveState !== 'idle' ? findControl(pressed, controls) : null;

  const COL = '1.05fr 1fr 48px';

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden text-slate-900">

      {/* ── Header ── */}
      <header className="flex-none flex items-center justify-between px-8 h-16 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <img
            src={logoUrl}
            alt="NexGlove — Tech In Your Hands"
            className="h-12 w-auto object-contain"
          />
          <span className="text-[9px] font-semibold tracking-[0.16em] uppercase text-slate-400 max-w-[140px] leading-tight">
            Wearable Control. Limitless Possibilities.
          </span>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <span
            className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md"
            style={{ color: BLUE, backgroundColor: '#eff4ff' }}
          >
            AI/ML Gesture Control
          </span>
        </div>
        <div className="text-right leading-tight">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: NAVY }}>Your Hand.</p>
          <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">A Smarter Experience.</p>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left panel — 34% */}
        <div className="w-[34%] min-w-[360px] flex flex-col border-r border-slate-200 px-7 py-5 overflow-hidden">

          {/* Title row */}
          <div className="flex-none flex items-start justify-between mb-4">
            <div>
              <h1 className="text-[16px] font-black tracking-tight uppercase leading-none" style={{ color: NAVY }}>
                My Custom Controls
              </h1>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Map button combinations to actions.
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg transition-colors shrink-0 mt-0.5"
            >
              <span className="text-sm leading-none font-light">+</span>
              Add Control
            </button>
          </div>

          {/* Table header */}
          <div
            className="flex-none grid items-center px-3 py-2 bg-slate-50 rounded-lg border border-slate-100"
            style={{ gridTemplateColumns: COL }}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-400 whitespace-nowrap">
              Operation / Action
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-400 whitespace-nowrap">
              Button Combination
            </span>
            <span />
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto min-h-0 mt-0.5 scrollbar-hide">
            {controls.length === 0 && (
              <div className="flex items-center justify-center h-24 text-xs text-slate-300">
                No controls yet.
              </div>
            )}
            {controls.map(control => (
              <div
                key={control.id}
                className="grid items-center px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                style={{ gridTemplateColumns: COL }}
              >
                {/* Operation name (+ text sub-line for Type Text) */}
                <div className="min-w-0 pr-2">
                  <span className="text-sm font-medium truncate block" style={{ color: NAVY }}>
                    {control.operation}
                  </span>
                  {control.text && (
                    <span className="text-[10px] text-slate-400 truncate block">
                      &ldquo;{control.text}&rdquo;
                    </span>
                  )}
                </div>
                <ComboPills buttons={control.buttons} />
                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(control)}
                    title="Edit"
                    className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => deleteControl(control.id)}
                    title="Delete"
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom feature area — Default Button Functions + AI Gesture Functions */}
          <div className="flex-none mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">

            {/* Default Button Functions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: NAVY }}>
                  Default Button Functions
                </h2>
              </div>
              <div className="space-y-1.5">
                {DEFAULT_FUNCTIONS.map(fn => (
                  <div
                    key={fn.id}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-1.5"
                  >
                    <div className="w-6 h-6 flex-none flex items-center justify-center rounded-md bg-white border border-slate-200" style={{ color: BLUE }}>
                      <DefaultIcon id={fn.id} />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <span className="text-[8px] font-bold tracking-[0.08em]" style={{ color: NAVY }}>
                        {fn.id}
                      </span>
                      <p className="text-[10px] font-medium text-slate-600 truncate">{fn.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Gesture Functions */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: NAVY }}>
                  AI Gesture Functions
                </h2>
                <span className="text-[7px] font-bold tracking-[0.1em] uppercase px-1 py-0.5 rounded" style={{ color: BLUE, backgroundColor: '#eff4ff' }}>
                  AI/ML
                </span>
              </div>
              <div className="space-y-1.5">
                {GESTURE_FUNCTIONS.map(fn => (
                  <div
                    key={fn.icon}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-1.5"
                  >
                    <div className="w-6 h-6 flex-none flex items-center justify-center rounded-md bg-white border border-slate-200" style={{ color: BLUE }}>
                      <GestureIcon id={fn.icon} />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <span className="text-[8px] font-bold tracking-[0.08em] block truncate" style={{ color: NAVY }}>
                        {fn.desc}
                      </span>
                      <p className="text-[10px] font-medium text-slate-600 truncate">{fn.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — 66% */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 bg-white min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
            Right Hand · Palm View
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] mb-5" style={{ color: BLUE }}>
            {modalOpen
              ? 'Tap the glove to assign a combination'
              : 'Tap the glove to test combinations'}
          </p>

          <div
            className="relative"
            style={{ height: 'min(84vh, 540px)', aspectRatio: '340 / 460' }}
          >
            <GlovePalm
              pressed={modalOpen ? modalBtns : pressed}
              state={modalOpen ? 'idle' : gloveState}
              onPress={handlePress}
            />
          </div>

          {/* Status hint */}
          <div className="h-10 mt-3 flex items-center justify-center">
            {(modalOpen ? modalBtns.length > 0 : pressed.length > 0) && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mr-1">
                  Selected:
                </span>
                <div className="flex items-center gap-1.5">
                  {[...(modalOpen ? modalBtns : pressed)].sort().flatMap((btn, i) => [
                    i > 0 ? (
                      <span key={`s-${i}`} className="text-sm font-medium text-slate-300">+</span>
                    ) : null,
                    <span
                      key={btn}
                      className={`text-xs font-bold px-2.5 py-1 rounded border transition-colors ${
                        !modalOpen && gloveState === 'invalid'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                      style={!modalOpen && gloveState === 'invalid' ? { animation: 'blinkRed 0.35s ease-in-out 3' } : undefined}
                    >
                      {btn}
                    </span>,
                  ])}
                </div>
                {!modalOpen && gloveState === 'valid' && matchedControl && (
                  <>
                    <span className="text-slate-300 text-sm">&#8594;</span>
                    <span className="text-xs font-semibold text-blue-700">
                      {matchedControl.text
                        ? `${matchedControl.operation} “${matchedControl.text}”`
                        : matchedControl.operation}
                    </span>
                  </>
                )}
                {!modalOpen && gloveState === 'invalid' && (
                  <span className="text-xs text-red-400 ml-0.5">No matching control</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <footer className="flex-none h-11 flex items-center gap-5 px-8 border-t border-slate-200 bg-white">

        <div className="flex items-center gap-2">
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
            <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke={BLUE} strokeWidth="1.5" />
            <rect x="2" y="2" width="13" height="7" rx="1.5" fill={BLUE} />
            <path d="M21 3.5 L21 7.5" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-bold" style={{ color: NAVY }}>87%</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">Battery</span>
        </div>

        <div className="h-3 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <svg width="13" height="16" viewBox="0 0 13 18" fill="none">
            <path
              d="M 6 2 L 6 16 M 6 2 L 11 6 L 6 10 L 11 14 L 6 16 M 1 6 L 6 10 M 1 14 L 6 10"
              stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: BLUE }}>Connected</span>
        </div>

        <div className="h-3 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <svg width="15" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-4 0v5" />
            <path d="M14 10V4a2 2 0 0 0-4 0v6" />
            <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">Hand Detected</span>
        </div>

        <div className="flex-1" />

        <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium">Settings</span>
        </button>
        <span className="text-slate-300 text-xs">|</span>
        <span className="text-[10px] text-slate-400">v1.0.0</span>
      </footer>

      {/* ── Modal ── */}
      {modalOpen && (
        <EditModal
          control={editTarget}
          controls={controls}
          btns={modalBtns}
          setBtns={setModalBtns}
          onSave={saveControl}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
