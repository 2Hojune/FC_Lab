const COLS_PER_ROW = 4

const isKnownText = (value) => {
    if (typeof value !== 'string') return false
    const normalized = value.trim().toLowerCase()
    return normalized !== '' && normalized !== 'unknown' && normalized !== 'null' && normalized !== 'undefined'
}

// 💡 스탯만 순수하게 그리는 컴포넌트로 역할 축소! (이름 렌더링 제거)
function StatsGrid({ stats }) {
    if (!stats) return null
    const { name, error, ...otherStats } = stats

    // 에러 발생 시 처리
    if (error) {
        return (
            <div style={{ color: '#e53935', fontSize: '18px', fontWeight: 'bold', margin: '20px 0' }}>
                ❌ 스탯 정보를 불러올 수 없습니다. ({error})
            </div>
        )
    }

    const filteredStatsArr = Object.entries(otherStats)
    if (filteredStatsArr.length === 0) {
        return <div style={{ color: 'var(--text)', fontSize: '16px', margin: '30px 0' }}>스탯 데이터가 없습니다.</div>
    }

    const rows = []
    for (let i = 0; i < filteredStatsArr.length; i += COLS_PER_ROW) {
        rows.push(filteredStatsArr.slice(i, i + COLS_PER_ROW))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {rows.map((row, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS_PER_ROW}, 1fr)`, gap: '16px' }}>
                    {row.map(([key, value]) => (
                        <div
                            key={key}
                            style={{
                                background: 'var(--code-bg, #f4f3ec)',
                                borderRadius: '9px',
                                border: '1.5px solid var(--accent-border, #c084fc)',
                                boxShadow: '0 1px 2px 0 rgba(170,59,255,0.07)',
                                padding: '10px 14px',
                                textAlign: 'center',
                                fontWeight: '500',
                                fontSize: '17px',
                                color: 'var(--text-h, #aa3bff)',
                            }}
                        >
                            <div style={{ fontSize: '13px', color: 'var(--text, #6b6375)', marginBottom: '2px', wordBreak: 'keep-all' }}>
                                {key}
                            </div>
                            <div style={{ fontWeight: 600 }}>{value}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

// 💡 이름과 시즌 배지는 여기서 전담합니다!
function PlayerInfo({ player, fallbackName }) {
    if (!player && !fallbackName) return null

    const displayName = player?.name || fallbackName
    const seasonBadge = player?.seasonName
    const seasonImg = player?.seasonImg

    return (
        <div style={{ marginBottom: '10px' }}>
      <span style={{ fontWeight: 700, fontSize: '26px', color: 'var(--accent, #aa3bff)', verticalAlign: 'middle' }}>
        {displayName}
      </span>

      {seasonImg ? (
        <img
          src={seasonImg}
          alt={seasonBadge || 'Season Logo'}
          style={{
            marginLeft: '12px',
            height: '24px', // 로고 크기 조절 (글자 크기와 어울리게 24px 추천)
            verticalAlign: 'middle',
            transform: 'translateY(-2px)' // 살짝 위로 올려서 텍스트와 줄 맞춤
          }}
        />
      ) : (
            isKnownText(seasonBadge) && (
                <span
                    style={{
                        marginLeft: '12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: 'var(--accent, #aa3bff)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        verticalAlign: 'middle',
                        display: 'inline-block',
                        transform: 'translateY(-2px)'
                    }}
                >
          {seasonBadge}
        </span>
            )
            )}
        </div>
    )
}

export default function PlayerCard({ selectedPlayer, playerStats, statLoading }) {
    if (!selectedPlayer) return null

    return (
        <div style={{ marginTop: '36px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div
                style={{
                    background: 'linear-gradient(135deg, var(--accent-bg, #f4f3ec), #fff 65%)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px -7px var(--shadow, #c084fc55)',
                    padding: '28px 30px 24px 30px',
                    minHeight: '160px',
                    textAlign: 'center',
                    border: '2.8px solid var(--accent-border, #c084fc77)',
                }}
            >
                <PlayerInfo player={selectedPlayer} fallbackName={playerStats?.name} />

                {statLoading ? (
                    <div style={{ fontSize: '16px', color: 'var(--accent)', fontWeight: 500, marginTop: '25px' }}>
                        스탯을 분석하고 있습니다...
                    </div>
                ) : playerStats ? (
                    <StatsGrid stats={playerStats} />
                ) : (
                    <div style={{ fontSize: '15px', color: 'var(--text)', marginTop: '20px' }}>
                        상세 스탯을 불러옵니다. (잠시만 기다려주세요)
                    </div>
                )}
            </div>
        </div>
    )
}