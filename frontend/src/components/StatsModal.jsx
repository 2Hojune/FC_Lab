import CategoryStatsBar from './CategoryStatsBar'
import StatsGrid from './StatsGrid'

export default function StatsModal({
    player,
    stats,
    baseStats,
    focusTraining,
    onFocusTrainingChange,
    allPlayers,
    compareEntries,
    onCompareToggle,
    statsColumns,
    loading,
    onClose,
}) {
    if (!player) return null

    const isCompareMode = statsColumns && statsColumns.length > 1
    const otherPlayers = (allPlayers ?? []).filter((p) => p.id !== player.id)

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-modal-title"
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: isCompareMode ? '920px' : '720px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    background: '#fff',
                    borderRadius: '18px',
                    border: '2px solid var(--accent-border, #c084fc77)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
                    padding: '24px 28px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <h2 id="stats-modal-title" style={{ margin: '0 0 6px 0', color: 'var(--accent, #aa3bff)', fontSize: '22px' }}>
                            {player.buildName}
                        </h2>
                        {stats?.name && (
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{stats.name}</div>
                        )}
                        <div style={{ fontSize: '13px', color: '#555' }}>
                            +{player.grade} · 적응도 {player.adaptability}
                            {player.teamColor && player.teamColor !== '없음' ? ` · ${player.teamColor}` : ''}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        style={{
                            border: 'none',
                            background: '#f0f0f0',
                            borderRadius: '8px',
                            width: '36px',
                            height: '36px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#555',
                            flexShrink: 0,
                        }}
                    >
                        ×
                    </button>
                </div>

                {otherPlayers.length > 0 && (
                    <div
                        style={{
                            marginTop: '16px',
                            padding: '12px 14px',
                            background: 'var(--code-bg, #f4f3ec)',
                            borderRadius: '10px',
                            border: '1px solid var(--accent-border, #e2c7ff)',
                        }}
                    >
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px' }}>
                            다른 선수와 비교 (최대 2명)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {otherPlayers.map((p) => {
                                const isSelected = compareEntries?.some((entry) => entry.player.id === p.id)
                                const isLoading = compareEntries?.some((entry) => entry.player.id === p.id && entry.loading)

                                return (
                                    <label
                                        key={p.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            padding: '6px 10px',
                                            background: isSelected ? 'var(--accent, #aa3bff)' : '#fff',
                                            color: isSelected ? '#fff' : '#333',
                                            borderRadius: '8px',
                                            border: '1px solid var(--accent-border, #c084fc)',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onCompareToggle(p.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {p.buildName}
                                        {isLoading && ' (로딩...)'}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '20px' }}>
                    {loading ? (
                        <div style={{ fontSize: '15px', color: 'var(--accent)', padding: '24px 0', textAlign: 'center' }}>
                            스탯을 계산하고 있습니다...
                        </div>
                    ) : (
                        <>
                            <CategoryStatsBar
                                stats={stats}
                                baseStats={baseStats}
                                columns={isCompareMode ? statsColumns : undefined}
                            />
                            <StatsGrid
                                stats={stats}
                                baseStats={baseStats}
                                ordered
                                editableFocusTraining
                                focusTraining={focusTraining}
                                onFocusTrainingChange={onFocusTrainingChange}
                                columns={isCompareMode ? statsColumns : undefined}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
