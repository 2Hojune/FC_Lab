import { useState, useEffect } from 'react'
import { getPlayerAbility, savedPlayerApi } from '../api/api'
import { calculateAppliedStats } from '../utils/applyPlayerStats'
import StatsGrid from './StatsGrid'

export default function MyLocker() {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({
        buildName: '',
        grade: 5,
        adaptability: 5,
        teamColor: ''
    })
    const [viewStatsId, setViewStatsId] = useState(null)
    const [calculatedStats, setCalculatedStats] = useState(null)
    const [isStatLoading, setIsStatLoading] = useState(false)

    const memberId = 1

    const fetchPlayers = async () => {
        try {
            setLoading(true)
            const data = await savedPlayerApi.getSavedPlayers(memberId)
            setPlayers(data)
        } catch (error) {
            console.error('보관함 조회 실패:', error)
            alert('보관함 데이터를 불러오는데 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlayers()
    }, [])

    const handleDelete = async (id, buildName) => {
        if (!window.confirm(`[${buildName}] 빌드를 정말 삭제하시겠습니까?`)) return
        try {
            await savedPlayerApi.deletePlayer(memberId, id)
            alert('삭제되었습니다.')
            if (viewStatsId === id) {
                setViewStatsId(null)
                setCalculatedStats(null)
            }
            setPlayers(players.filter(player => player.id !== id))
        } catch (error) {
            console.error('삭제 실패:', error)
        }
    }

    const handleEditStart = (player) => {
        setEditingId(player.id)
        setViewStatsId(null)
        setCalculatedStats(null)
        setEditForm({
            buildName: player.buildName,
            grade: player.grade,
            adaptability: player.adaptability,
            teamColor: player.teamColor
        })
    }

    const handleEditCancel = () => {
        setEditingId(null)
    }

    const handleEditSubmit = async (player) => {
        if (!editForm.buildName.trim()) {
            alert('빌드명을 입력해주세요!')
            return
        }

        const requestData = {
            buildName: editForm.buildName,
            spid: player.spid,
            grade: Number(editForm.grade),
            adaptability: Number(editForm.adaptability),
            teamColor: editForm.teamColor || '없음',
            focusTraining: player.focusTraining
        }

        try {
            await savedPlayerApi.updatePlayer(memberId, player.id, requestData)
            alert('수정되었습니다!')
            setEditingId(null)
            await fetchPlayers()
        } catch (error) {
            console.error('수정 실패:', error)
            alert('수정 중 오류가 발생했습니다.')
        }
    }

    const handleNameClick = async (player) => {
        if (viewStatsId === player.id) {
            setViewStatsId(null)
            setCalculatedStats(null)
            return
        }

        setViewStatsId(player.id)
        setCalculatedStats(null)
        setIsStatLoading(true)

        try {
            const baseStats = await getPlayerAbility(player.spid)
            const finalStats = calculateAppliedStats(baseStats, player)
            setCalculatedStats(finalStats)
        } catch (error) {
            console.error('스탯 조회 실패:', error)
            alert('기본 스탯을 불러오지 못했습니다.')
            setViewStatsId(null)
        } finally {
            setIsStatLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: 'var(--accent)' }}>
                보관함을 불러오는 중입니다...
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
            <h2 style={{ color: 'var(--accent, #aa3bff)', marginBottom: '24px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                내 선수 보관함
            </h2>

            {players.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '60px 20px', background: '#f9f9f9', borderRadius: '16px' }}>
                    보관함이 텅 비어있습니다.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                    {players.map(player => (
                        <div
                            key={player.id}
                            style={{
                                background: '#fff',
                                border: '2px solid var(--accent-border, #c084fc77)',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 4px 15px rgba(170,59,255,0.08)'
                            }}
                        >
                            {editingId === player.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input
                                        value={editForm.buildName}
                                        onChange={e => setEditForm({ ...editForm, buildName: e.target.value })}
                                        style={{ padding: '8px', fontWeight: 'bold', fontSize: '16px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <select
                                            value={editForm.grade}
                                            onChange={e => setEditForm({ ...editForm, grade: Number(e.target.value) })}
                                            style={{ padding: '5px' }}
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>+{i + 1}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={editForm.adaptability}
                                            onChange={e => setEditForm({ ...editForm, adaptability: Number(e.target.value) })}
                                            style={{ padding: '5px' }}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>적응도 {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        value={editForm.teamColor}
                                        onChange={e => setEditForm({ ...editForm, teamColor: e.target.value })}
                                        placeholder="팀 컬러"
                                        style={{ padding: '8px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button
                                            onClick={() => handleEditSubmit(player)}
                                            style={{ flex: 1, padding: '8px', background: 'var(--accent)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                        >
                                            저장
                                        </button>
                                        <button
                                            onClick={handleEditCancel}
                                            style={{ flex: 1, padding: '8px', background: '#ccc', color: '#333', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3
                                        onClick={() => handleNameClick(player)}
                                        style={{
                                            margin: '0 0 12px 0',
                                            color: 'var(--text-h, #333)',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            textDecoration: viewStatsId === player.id ? 'underline' : 'none'
                                        }}
                                        title="클릭하여 최종 스탯 보기"
                                    >
                                        {player.buildName}
                                    </h3>
                                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.7' }}>
                                        <div><strong>ID:</strong> {player.spid}</div>
                                        <div><strong>강화:</strong> +{player.grade}</div>
                                        <div><strong>적응도:</strong> {player.adaptability}</div>
                                        <div><strong>팀 컬러:</strong> {player.teamColor}</div>
                                    </div>

                                    {viewStatsId === player.id && (
                                        <div
                                            style={{
                                                marginTop: '16px',
                                                padding: '14px',
                                                background: 'var(--code-bg, #f4f3ec)',
                                                borderRadius: '12px',
                                                border: '1px solid var(--accent-border, #e2c7ff)'
                                            }}
                                        >
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                                                적용 스탯 (+{player.grade} · 적응도 {player.adaptability})
                                            </div>
                                            {calculatedStats?.name && (
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                                    {calculatedStats.name}
                                                </div>
                                            )}
                                            {isStatLoading ? (
                                                <div style={{ fontSize: '14px', color: 'var(--accent)', padding: '12px 0' }}>
                                                    스탯을 계산하고 있습니다...
                                                </div>
                                            ) : (
                                                <StatsGrid stats={calculatedStats} />
                                            )}
                                        </div>
                                    )}

                                    {player.focusTraining && Object.keys(player.focusTraining).length > 0 && (
                                        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--code-bg, #f4f3ec)', borderRadius: '10px' }}>
                                            <strong style={{ fontSize: '13px', color: 'var(--accent)' }}>집중 훈련</strong>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                                {Object.entries(player.focusTraining).map(([stat, val]) => (
                                                    <span
                                                        key={stat}
                                                        style={{ background: '#fff', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}
                                                    >
                                                        {stat} <span style={{ color: 'var(--accent)' }}>+{val}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button
                                            onClick={() => handleEditStart(player)}
                                            style={{ flex: 1, padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(player.id, player.buildName)}
                                            style={{ flex: 1, padding: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
