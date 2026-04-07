import { useState } from 'react'
import { searchPlayersByName, getPlayerAbility } from './api/api'
import SearchBar from './components/SearchBar'
import PlayerCard from './components/PlayerCard'

const isKnownText = (value) => {
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase()
  return normalized !== '' && normalized !== 'unknown' && normalized !== 'null' && normalized !== 'undefined'
}

function App() {
  const [name, setName] = useState('')
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [statLoading, setStatLoading] = useState(false)
  const [playerStats, setPlayerStats] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const handleSearch = async () => {
    if (name === '') return
    setLoading(true)
    setPlayerStats(null)
    setSelectedPlayer(null)
    try {
      setPlayers(await searchPlayersByName(name))
    } catch (error) {
      console.error('데이터 가져오기 실패:', error)
      alert('백엔드와 연결되지 않았습니다! 서버가 켜져 있는지 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerClick = async (player) => {
    setPlayerStats(null)
    setSelectedPlayer(player)
    setStatLoading(true)
    try {
      setPlayerStats(await getPlayerAbility(player.id))
    } catch (err) {
      console.error('스탯 데이터 가져오기 실패:', err)
      alert('스탯 정보를 불러오지 못했습니다!')
    } finally {
      setStatLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>⚽ FC Lab 선수 검색</h1>
      <SearchBar
        name={name}
        onNameChange={setName}
        onSearch={handleSearch}
        loading={loading}
        selectedPlayer={selectedPlayer}
        playerStats={playerStats}
      />
      <hr />
      <h2>검색 결과 ({players.length}명)</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {players.map((player) => (
          <li
            key={player.id}
            style={{
              margin: '10px 0',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px 14px',
              borderRadius: '7px',
              background:
                selectedPlayer && selectedPlayer.id === player.id
                  ? 'var(--accent-bg, #f4f3ec)'
                  : 'transparent',
              border:
                selectedPlayer && selectedPlayer.id === player.id
                  ? '2px solid var(--accent, #aa3bff)'
                  : '2px solid transparent',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onClick={() => handlePlayerClick(player)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' ? handlePlayerClick(player) : null)}
          >
            <strong>{player.name}</strong>
            {isKnownText(player.seasonName) ? ` · ${player.seasonName}` : ''}
          </li>
        ))}
      </ul>
      <PlayerCard selectedPlayer={selectedPlayer} playerStats={playerStats} statLoading={statLoading} />
    </div>
  )
}

export default App
