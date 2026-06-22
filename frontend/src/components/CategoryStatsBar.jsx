import { calculateCategoryStats, getCategoryStatValue, STAT_CATEGORIES } from '../constants/statCategories'
import CompareStatValue from './CompareStatValue'

export default function CategoryStatsBar({ stats, baseStats, columns }) {
    const isCompareMode = columns && columns.length > 1

    if (isCompareMode) {
        const validColumns = columns.filter((col) => col.stats && !col.stats.error)
        if (validColumns.length === 0) return null

        return (
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '10px' }}>
                    종합 능력치
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${validColumns.length}, 1fr)`,
                        gap: '10px',
                    }}
                >
                    {validColumns.map((col) => (
                        <div
                            key={col.player.id}
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-bg, #f4f3ec), #fff)',
                                borderRadius: '10px',
                                border: col.isPrimary ? '2px solid var(--accent, #aa3bff)' : '2px solid var(--accent-border, #c084fc)',
                                padding: '10px',
                            }}
                        >
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px', textAlign: 'center' }}>
                                {col.player.buildName}
                                {col.isPrimary && <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>(현재)</span>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {STAT_CATEGORIES.map(({ label }) => {
                                    const value = getCategoryStatValue(col.stats, label)
                                    const allValues = validColumns.map((c) => getCategoryStatValue(c.stats, label))

                                    return (
                                        <div
                                            key={label}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                fontSize: '13px',
                                                padding: '4px 6px',
                                                background: '#fff',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            <span style={{ color: '#666', fontWeight: 600 }}>{label}</span>
                                            <CompareStatValue value={value} compareValues={allValues} size="md" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!stats || stats.error || !baseStats) return null

    const categories = calculateCategoryStats(stats, baseStats)
    if (categories.length === 0) return null

    return (
        <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '10px' }}>
                종합 능력치
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                }}
            >
                {categories.map(({ label, value, delta }) => (
                    <div
                        key={label}
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-bg, #f4f3ec), #fff)',
                            borderRadius: '10px',
                            border: '2px solid var(--accent-border, #c084fc)',
                            padding: '12px 10px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '13px', color: 'var(--text, #6b6375)', marginBottom: '4px', fontWeight: 600 }}>
                            {label}
                        </div>
                        <CompareStatValue value={value} baseDelta={delta} size="lg" />
                    </div>
                ))}
            </div>
        </div>
    )
}
