const COLS_PER_ROW = 4

function StatsGrid({ stats }) {
  if (!stats) return null

  const { name, error, ...otherStats } = stats
  const filteredStatsArr = Object.entries(otherStats)
  const rows = []
  for (let i = 0; i < filteredStatsArr.length; i += COLS_PER_ROW) {
    rows.push(filteredStatsArr.slice(i, i + COLS_PER_ROW))
  }

  const displayName = name || error
  const isError = !!error

  return (
    <div>
      {displayName && (
        <div
          style={{
            fontWeight: 700,
            fontSize: isError ? '22px' : '26px',
            color: isError ? '#e53935' : 'var(--accent, #aa3bff)',
            marginBottom: isError ? '16px' : '18px',
            letterSpacing: '0.5px',
          }}
        >
          {displayName}
        </div>
      )}

      {filteredStatsArr.length === 0 && !isError && (
        <div style={{ color: 'var(--text)', fontSize: '16px', margin: '30px 0' }}>
          스탯 데이터가 없습니다.
        </div>
      )}

      {filteredStatsArr.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rows.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS_PER_ROW}, 1fr)`,
                gap: '16px',
              }}
            >
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
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text, #6b6375)',
                      marginBottom: '2px',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {key}
                  </div>
                  <div style={{ fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PlayerCard({ selectedPlayer, playerStats, statLoading }) {
  if (!selectedPlayer) return null

  return (
    <div
      style={{
        marginTop: '36px',
        maxWidth: '480px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
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
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontWeight: 700, fontSize: '23px', color: 'var(--accent, #aa3bff)' }}>
            {selectedPlayer.name}
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 400,
              marginLeft: '12px',
              color: 'var(--text, #6b6375)',
            }}
          >
            (SPID: {selectedPlayer.id})
          </span>
        </div>
        {statLoading ? (
          <div
            style={{
              fontSize: '18px',
              color: 'var(--accent)',
              fontWeight: 500,
              marginTop: '25px',
            }}
          >
            스탯 불러오는 중...
          </div>
        ) : playerStats ? (
          <StatsGrid stats={playerStats} />
        ) : (
          <div style={{ fontSize: '15px', color: 'var(--text)' }}>
            상세 스탯을 불러옵니다. (잠시만 기다려주세요)
          </div>
        )}
      </div>
    </div>
  )
}
