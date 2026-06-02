import { useState, useEffect } from 'react'
import { savedPlayerApi } from '../api/api'

export default function MyLocker() {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)

    const memberId = 1 // 테스트용 임시 멤버 ID

    // 1. 보관함 데이터 불러오기 (GET)
    const fetchPlayers = async () => {
        try {
            setLoading(true)
            const data = await savedPlayerApi.getSavedPlayers(memberId)
            setPlayers(data)
        } catch (error) {
            console.error("보관함 조회 실패:", error)
            alert("보관함 데이터를 불러오는데 실패했습니다.")
        } finally {
            setLoading(false)
        }
    }

    // 컴포넌트가 화면에 나타날 때 딱 한 번 실행
    useEffect(() => {
        fetchPlayers()
    }, [])

    // 2. 선수 삭제하기 (DELETE)
    const handleDelete = async (id, buildName) => {
        if (!window.confirm(`[${buildName}] 빌드를 정말 삭제하시겠습니까?`)) return

        try {
            await savedPlayerApi.deletePlayer(memberId, id)
            alert("삭제되었습니다.")
            // 💡 서버에서 다시 전체 목록을 안 불러와도, 프론트엔드 배열에서 해당 카드만 쏙 빼서 화면을 가볍게 갱신합니다!
            setPlayers(players.filter(player => player.id !== id))
        } catch (error) {
            console.error("삭제 실패:", error)
            alert("삭제 중 오류가 발생했습니다.")
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: 'var(--accent)' }}>🗂️ 보관함을 불러오는 중입니다...</div>
    }

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
            <h2 style={{ color: 'var(--accent, #aa3bff)', marginBottom: '24px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                🗂️ 내 선수 보관함
            </h2>

            {players.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '60px 20px', background: '#f9f9f9', borderRadius: '16px' }}>
                    보관함이 텅 비어있습니다.<br/>나만의 선수 레시피를 커스텀해서 저장해보세요!
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                    {players.map(player => (
                        <div key={player.id} style={{
                            background: '#fff',
                            border: '2px solid var(--accent-border, #c084fc77)',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 4px 15px rgba(170,59,255,0.08)',
                            position: 'relative'
                        }}>
                            <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-h, #333)', fontSize: '20px' }}>🔥 {player.buildName}</h3>
                            
                            <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.7' }}>
                                <div><strong>ID:</strong> {player.spid}</div>
                                <div><strong>강화:</strong> +{player.grade}</div>
                                <div><strong>적응도:</strong> {player.adaptability}</div>
                                <div><strong>팀 컬러:</strong> {player.teamColor}</div>
                            </div>

                            {/* 집중 훈련 Map 데이터 렌더링 */}
                            {player.focusTraining && Object.keys(player.focusTraining).length > 0 && (
                                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--code-bg, #f4f3ec)', borderRadius: '10px' }}>
                                    <strong style={{ fontSize: '13px', color: 'var(--accent)' }}>💪 집중 훈련</strong>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                        {Object.entries(player.focusTraining).map(([stat, val]) => (
                                            <span key={stat} style={{ 
                                                background: '#fff', 
                                                border: '1px solid #ddd',
                                                padding: '4px 8px', 
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {stat} <span style={{ color: 'var(--accent)' }}>+{val}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => handleDelete(player.id, player.buildName)}
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    padding: '10px',
                                    background: '#ff4d4f',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#e63946'}
                                onMouseOut={(e) => e.target.style.background = '#ff4d4f'}
                            >
                                🗑️ 보관함에서 빼기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}