import { getOrderedStatEntries, getOrderedStatEntriesWithDelta, getStatValue } from '../constants/statOrder'
import { clampFocusTrainingValue } from '../utils/applyPlayerStats'
import CompareStatValue from './CompareStatValue'
import FocusStepper from './FocusStepper'

const DEFAULT_COLS = 4
const ORDERED_COLS = 2

export default function StatsGrid({
    stats,
    baseStats,
    ordered = false,
    focusTraining,
    onFocusTrainingChange,
    editableFocusTraining = false,
    columns,
}) {
    const isCompareMode = columns && columns.length > 1

    if (!isCompareMode && !stats) return null

    if (!isCompareMode && stats?.error) {
        return (
            <div style={{ color: '#e53935', fontSize: '16px', fontWeight: 'bold', margin: '12px 0' }}>
                스탯 정보를 불러올 수 없습니다. ({stats.error})
            </div>
        )
    }

    const validColumns = isCompareMode
        ? columns.filter((col) => col.stats && !col.stats.error)
        : []

    if (isCompareMode && validColumns.length === 0) {
        return (
            <div style={{ color: 'var(--text)', fontSize: '14px', margin: '12px 0' }}>
                비교할 스탯을 불러오는 중이거나 데이터가 없습니다.
            </div>
        )
    }

    const statKeys = isCompareMode
        ? getOrderedStatEntries(validColumns[0].stats).map(([key]) => key)
        : null

    const statItems = !isCompareMode
        ? (ordered
            ? baseStats
                ? getOrderedStatEntriesWithDelta(stats, baseStats)
                : getOrderedStatEntries(stats).map(([key, value]) => ({
                    key,
                    value: Number.parseInt(String(value), 10),
                    delta: 0,
                }))
            : Object.entries(stats)
                .filter(([key, value]) => {
                    if (key === 'name' || key === 'error') return false
                    const parsed = Number.parseInt(String(value), 10)
                    return !Number.isNaN(parsed)
                })
                .map(([key, value]) => ({
                    key,
                    value: Number.parseInt(String(value), 10),
                    delta: 0,
                })))
        : statKeys.map((key) => ({ key }))

    if (statItems.length === 0) {
        return (
            <div style={{ color: 'var(--text)', fontSize: '14px', margin: '12px 0' }}>
                표시할 능력치가 없습니다.
            </div>
        )
    }

    const colsPerRow = ordered ? ORDERED_COLS : DEFAULT_COLS
    const rows = []
    for (let i = 0; i < statItems.length; i += colsPerRow) {
        rows.push(statItems.slice(i, i + colsPerRow))
    }

    const handleFocusChange = (statKey, nextValue) => {
        if (!onFocusTrainingChange) return
        onFocusTrainingChange(statKey, clampFocusTrainingValue(nextValue))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {editableFocusTraining && !isCompareMode && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                    스탯 옆 ▲▼로 집중훈련 조절 (0~2)
                </div>
            )}
            {isCompareMode && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                    더 높은 스탯 왼쪽에 +차이 표시 · 현재 선수만 집중훈련 조절 가능
                </div>
            )}
            {rows.map((row, idx) => (
                <div
                    key={idx}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                        gap: '10px',
                    }}
                >
                    {row.map((item) => {
                        const { key } = item

                        if (isCompareMode) {
                            const allValues = validColumns.map((col) => getStatValue(col.stats, key))

                            return (
                                <div
                                    key={key}
                                    style={{
                                        background: 'var(--code-bg, #f4f3ec)',
                                        borderRadius: '8px',
                                        border: '1.5px solid var(--accent-border, #c084fc)',
                                        padding: '10px 12px',
                                        fontSize: '15px',
                                        color: 'var(--text-h, #aa3bff)',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--text, #6b6375)',
                                            marginBottom: '8px',
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            wordBreak: 'keep-all',
                                        }}
                                    >
                                        {key}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {validColumns.map((col) => (
                                            <div
                                                key={col.player.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '4px 6px',
                                                    background: '#fff',
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>
                                                        {col.player.buildName}
                                                    </div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <CompareStatValue
                                                            value={getStatValue(col.stats, key)}
                                                            compareValues={allValues}
                                                        />
                                                    </div>
                                                </div>
                                                {col.isPrimary && editableFocusTraining && (
                                                    <FocusStepper
                                                        value={focusTraining?.[key] ?? 0}
                                                        onChange={(next) => handleFocusChange(key, next)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        const { value, delta } = item

                        return (
                            <div
                                key={key}
                                style={{
                                    background: 'var(--code-bg, #f4f3ec)',
                                    borderRadius: '8px',
                                    border: '1.5px solid var(--accent-border, #c084fc)',
                                    padding: '10px 12px',
                                    fontWeight: '500',
                                    fontSize: '15px',
                                    color: 'var(--text-h, #aa3bff)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: 'var(--text, #6b6375)',
                                                marginBottom: '4px',
                                                wordBreak: 'keep-all',
                                            }}
                                        >
                                            {key}
                                        </div>
                                        <CompareStatValue value={value} baseDelta={delta} />
                                    </div>
                                    {editableFocusTraining && (
                                        <FocusStepper
                                            value={focusTraining?.[key] ?? 0}
                                            onChange={(next) => handleFocusChange(key, next)}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
