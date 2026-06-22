import { FOCUS_TRAINING_MIN, FOCUS_TRAINING_MAX } from '../utils/applyPlayerStats'

export default function FocusStepper({ value, onChange }) {
    const current = value ?? 0

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1.5px solid var(--accent-border, #c084fc)',
                borderRadius: '8px',
                background: '#fff',
                overflow: 'hidden',
                flexShrink: 0,
                width: '36px',
            }}
        >
            <button
                type="button"
                onClick={() => onChange(current + 1)}
                disabled={current >= FOCUS_TRAINING_MAX}
                aria-label="집중훈련 증가"
                style={{
                    width: '100%',
                    border: 'none',
                    background: current >= FOCUS_TRAINING_MAX ? '#f5f5f5' : 'var(--accent-bg, #f4f3ec)',
                    color: current >= FOCUS_TRAINING_MAX ? '#bbb' : 'var(--accent, #aa3bff)',
                    cursor: current >= FOCUS_TRAINING_MAX ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    padding: '4px 0',
                    lineHeight: 1,
                }}
            >
                ▲
            </button>
            <div
                style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: current > 0 ? 'var(--accent, #aa3bff)' : '#888',
                    padding: '4px 0',
                    borderTop: '1px solid #eee',
                    borderBottom: '1px solid #eee',
                }}
            >
                {current}
            </div>
            <button
                type="button"
                onClick={() => onChange(current - 1)}
                disabled={current <= FOCUS_TRAINING_MIN}
                aria-label="집중훈련 감소"
                style={{
                    width: '100%',
                    border: 'none',
                    background: current <= FOCUS_TRAINING_MIN ? '#f5f5f5' : 'var(--accent-bg, #f4f3ec)',
                    color: current <= FOCUS_TRAINING_MIN ? '#bbb' : 'var(--accent, #aa3bff)',
                    cursor: current <= FOCUS_TRAINING_MIN ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    padding: '4px 0',
                    lineHeight: 1,
                }}
            >
                ▼
            </button>
        </div>
    )
}
