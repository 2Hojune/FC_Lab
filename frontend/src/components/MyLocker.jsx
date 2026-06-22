import { useState, useEffect, useRef } from 'react'
import { getPlayerAbility, savedPlayerApi } from '../api/api'
import {
    calculateAppliedStats,
    hasAbilityStats,
    normalizeFocusTraining,
} from '../utils/applyPlayerStats'
import { loadPlayerStats } from '../utils/loadPlayerStats'
import StatsModal from './StatsModal'

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
    const [statsModalPlayer, setStatsModalPlayer] = useState(null)
    const [baseStats, setBaseStats] = useState(null)
    const [calculatedStats, setCalculatedStats] = useState(null)
    const [modalFocusTraining, setModalFocusTraining] = useState({})
    const [compareEntries, setCompareEntries] = useState([])
    const [isStatLoading, setIsStatLoading] = useState(false)
    const statRequestRef = useRef(0)

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

    const closeStatsModal = () => {
        statRequestRef.current += 1
        setStatsModalPlayer(null)
        setBaseStats(null)
        setCalculatedStats(null)
        setModalFocusTraining({})
        setCompareEntries([])
        setIsStatLoading(false)
    }

    const buildStatsColumns = () => {
        if (!statsModalPlayer || !calculatedStats || calculatedStats.error) return []

        const primary = {
            player: statsModalPlayer,
            stats: calculatedStats,
            baseStats,
            isPrimary: true,
        }

        const compared = compareEntries
            .filter((entry) => entry.stats && !entry.loading && !entry.error)
            .map((entry) => ({
                player: entry.player,
                stats: entry.stats,
                baseStats: entry.baseStats,
                isPrimary: false,
            }))

        return [primary, ...compared]
    }

    const handleCompareToggle = async (playerId) => {
        const existing = compareEntries.find((entry) => entry.player.id === playerId)

        if (existing) {
            setCompareEntries((prev) => prev.filter((entry) => entry.player.id !== playerId))
            return
        }

        if (compareEntries.length >= 2) {
            alert('최대 2명까지 비교할 수 있습니다.')
            return
        }

        const targetPlayer = players.find((p) => p.id === playerId)
        if (!targetPlayer) return

        setCompareEntries((prev) => [
            ...prev,
            { player: targetPlayer, stats: null, baseStats: null, loading: true },
        ])

        try {
            const result = await loadPlayerStats(targetPlayer)

            if (result.error) {
                alert(result.error)
                setCompareEntries((prev) => prev.filter((entry) => entry.player.id !== playerId))
                return
            }

            setCompareEntries((prev) =>
                prev.map((entry) =>
                    entry.player.id === playerId
                        ? { ...entry, ...result, loading: false }
                        : entry
                )
            )
        } catch (error) {
            console.error('비교 선수 스탯 조회 실패:', error)
            alert('비교 선수 스탯을 불러오지 못했습니다.')
            setCompareEntries((prev) => prev.filter((entry) => entry.player.id !== playerId))
        }
    }

    const recalculateModalStats = (player, fetchedBaseStats, focusTraining) => {
        setCalculatedStats(
            calculateAppliedStats(fetchedBaseStats, { ...player, focusTraining })
        )
    }

    const handleFocusTrainingChange = (statKey, value) => {
        setModalFocusTraining((prev) => {
            const next = { ...prev }
            if (value <= 0) {
                delete next[statKey]
            } else {
                next[statKey] = value
            }

            if (baseStats && statsModalPlayer) {
                recalculateModalStats(statsModalPlayer, baseStats, next)
            }

            return next
        })
    }

    const handleDelete = async (id, buildName) => {
        if (!window.confirm(`[${buildName}] 빌드를 정말 삭제하시겠습니까?`)) return
        try {
            await savedPlayerApi.deletePlayer(memberId, id)
            alert('삭제되었습니다.')
            if (statsModalPlayer?.id === id) {
                closeStatsModal()
            }
            setPlayers(players.filter(player => player.id !== id))
        } catch (error) {
            console.error('삭제 실패:', error)
        }
    }

    const handleEditStart = (player) => {
        setEditingId(player.id)
        closeStatsModal()
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
        const requestId = ++statRequestRef.current
        setStatsModalPlayer(player)
        setBaseStats(null)
        setCalculatedStats(null)
        setModalFocusTraining({})
        setCompareEntries([])
        setIsStatLoading(true)

        try {
            const fetchedBaseStats = await getPlayerAbility(player.spid)

            if (requestId !== statRequestRef.current) return

            if (!hasAbilityStats(fetchedBaseStats)) {
                setCalculatedStats({
                    error: `spid(${player.spid}) 능력치를 불러오지 못했습니다. 선수 검색에서 해당 선수를 다시 선택해 저장해주세요.`,
                })
                return
            }

            const initialFocusTraining = normalizeFocusTraining(player.focusTraining, fetchedBaseStats)

            setBaseStats(fetchedBaseStats)
            setModalFocusTraining(initialFocusTraining)
            recalculateModalStats(player, fetchedBaseStats, initialFocusTraining)
        } catch (error) {
            console.error('스탯 조회 실패:', error)
            if (requestId === statRequestRef.current) {
                setCalculatedStats({ error: '기본 스탯을 불러오지 못했습니다.' })
            }
        } finally {
            if (requestId === statRequestRef.current) {
                setIsStatLoading(false)
            }
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
                                            textDecoration: 'underline',
                                            textUnderlineOffset: '3px'
                                        }}
                                        title="클릭하여 적용 스탯 보기"
                                    >
                                        {player.buildName}
                                    </h3>
                                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.7' }}>
                                        <div><strong>ID:</strong> {player.spid}</div>
                                        <div><strong>강화:</strong> +{player.grade}</div>
                                        <div><strong>적응도:</strong> {player.adaptability}</div>
                                        <div><strong>팀 컬러:</strong> {player.teamColor}</div>
                                    </div>

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

            <StatsModal
                player={statsModalPlayer}
                stats={calculatedStats}
                baseStats={baseStats}
                focusTraining={modalFocusTraining}
                onFocusTrainingChange={handleFocusTrainingChange}
                allPlayers={players}
                compareEntries={compareEntries}
                onCompareToggle={handleCompareToggle}
                statsColumns={buildStatsColumns()}
                loading={isStatLoading}
                onClose={closeStatsModal}
            />
        </div>
    )
}
