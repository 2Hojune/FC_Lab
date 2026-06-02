import { useState } from 'react'

import { savedPlayerApi } from '../api/api'

const COLS_PER_ROW = 4

const isKnownText = (value) => {
    if (typeof value !== 'string') return false
    const normalized = value.trim().toLowerCase()
    return normalized !== '' && normalized !== 'unknown' && normalized !== 'null' && normalized !== 'undefined'
}

// 💡 스탯만 순수하게 그리는 컴포넌트로 역할 축소! (이름 렌더링 제거)
function StatsGrid({ stats }) {
    if (!stats) return null
    const { error, ...otherStats } = stats

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
    const [saving, setSaving] = useState(false)
    const [buildName, setBuildName] = useState('')
    const [grade, setGrade] = useState(5)
    const [adaptability, setAdaptability] = useState(5)
    const [teamColor, setTeamColor] = useState('')

    const handleSavePlayer = async () => {
        if (!buildName.trim()) {
            alert('빌드명을 입력해주세요! (예: 침투형 톱 쏜)')
            return
        }

        const memberId = 1 // 현재 로그인된/테스트용 멤버 ID

        // selectedPlayer의 id가 백엔드에서 요구하는 spid로 매핑되는 것으로 가정합니다.
        const spid = selectedPlayer?.spid ?? selectedPlayer?.id
        if (!spid) {
            alert('선수 ID(spid)를 찾지 못해 저장할 수 없습니다.')
            return
        }

        // 백엔드 SavedPlayerRequest DTO 규격에 맞게 포장
        const requestData = {
            buildName: buildName.trim(),
            spid,
            grade: Number(grade),
            adaptability: Number(adaptability),
            teamColor: teamColor.trim() || '없음',
            focusTraining:
                playerStats?.focusTraining ?? {
                    speed: 0,
                    dribble: 0,
                },
        }

        try {
            setSaving(true)
            const savedId = await savedPlayerApi.savePlayer(memberId, requestData)
            alert(`선수가 보관함에 성공적으로 저장되었습니다! (ID: ${savedId})`)
            setBuildName('')
            setTeamColor('')
        } catch (error) {
            console.error('저장 실패:', error)
            alert('선수 저장에 실패했습니다.')
        } finally {
            setSaving(false)
        }
    }

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

                <div
                    style={{
                        marginTop: '20px',
                        textAlign: 'left',
                        background: 'var(--code-bg, #f9f9f9)',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid var(--accent-border, #e2c7ff)',
                    }}
                >
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-h)' }}>커스텀 설정</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <label style={{ fontSize: '14px', marginRight: '10px' }}>빌드명:</label>
                            <input
                                type="text"
                                value={buildName}
                                onChange={(e) => setBuildName(e.target.value)}
                                placeholder="예: 침투형 톱 쏜"
                                style={{
                                    marginTop: '6px',
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '14px', marginRight: '10px' }}>강화:</label>
                                <select
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    style={{ marginTop: '6px', padding: '7px', borderRadius: '8px', border: '1px solid #ccc' }}
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            +{i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '14px', marginRight: '10px' }}>적응도:</label>
                                <select
                                    value={adaptability}
                                    onChange={(e) => setAdaptability(e.target.value)}
                                    style={{ marginTop: '6px', padding: '7px', borderRadius: '8px', border: '1px solid #ccc' }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '14px', marginRight: '10px' }}>팀 컬러:</label>
                            <input
                                type="text"
                                value={teamColor}
                                onChange={(e) => setTeamColor(e.target.value)}
                                placeholder="예: 토트넘 핫스퍼"
                                style={{
                                    marginTop: '6px',
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '22px' }}>
                    <button
                        type="button"
                        onClick={handleSavePlayer}
                        disabled={saving || statLoading}
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1.8px solid var(--accent-border, #c084fc77)',
                            background: saving || statLoading ? 'rgba(170,59,255,0.35)' : 'var(--accent, #aa3bff)',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 800,
                            cursor: saving || statLoading ? 'not-allowed' : 'pointer',
                            boxShadow: saving ? 'none' : '0 10px 25px -12px rgba(170,59,255,0.55)',
                            transition: 'transform 0.1s, background 0.2s',
                        }}
                    >
                        {saving ? '저장 중...' : '선수 보관함에 저장'}
                    </button>
                </div>
            </div>
        </div>
    )
}