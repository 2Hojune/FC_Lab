import { useState } from 'react'
import axios from 'axios'

function App() {
  const [Name, setName] = useState('')
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [statLoading, setStatLoading] = useState(false)
  const [playerStats, setPlayerStats] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  // 백엔드로 검색 요청을 보내는 함수!
  const handleSearch = async () => {
    if (Name === '') return;
    setLoading(true);
    setPlayerStats(null);
    setSelectedPlayer(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/players/name/${Name}`);
      setPlayers(response.data);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      alert("백엔드와 연결되지 않았습니다! 서버가 켜져 있는지 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }

  // 선수 클릭 시 상세 스탯 요청 함수
  const handlePlayerClick = async (player) => {
    setPlayerStats(null);
    setSelectedPlayer(player);
    setStatLoading(true);
    try {
      const statRes = await axios.get(`http://localhost:8080/api/players/ability/${player.id}`);
      setPlayerStats(statRes.data);
    } catch (err) {
      console.error("스탯 데이터 가져오기 실패:", err);
      alert("스탯 정보를 불러오지 못했습니다!");
    } finally {
      setStatLoading(false);
    }
  }

  // 스탯 카드 UI 격자 배열 (4열 배치, name/error는 상단에 별도 표시)
  const renderStatsGrid = (stats) => {
    if (!stats) return null;

    // name과 error는 헤더에서 따로 표시하고, 나머지만 추출
    const { name, error, ...otherStats } = stats;

    // key, value 쌍 배열 생성(순서 고정 필요시 Object.keys로 관리)
    const filteredStatsArr = Object.entries(otherStats);

    // 4열씩 row로 묶기
    const colsPerRow = 4;
    const rows = [];
    for (let i = 0; i < filteredStatsArr.length; i += colsPerRow) {
      rows.push(filteredStatsArr.slice(i, i + colsPerRow));
    }

    // 헤더에 표시될 이름(오브젝트 내 name/error 우선)
    const displayName = name || error;
    const isError = !!error;

    return (
      <div>
        {displayName && (
          <div style={{
            fontWeight: 700,
            fontSize: isError ? "22px" : "26px",
            color: isError ? "#e53935" : "var(--accent, #aa3bff)",
            marginBottom: isError ? "16px" : "18px",
            letterSpacing: "0.5px"
          }}>
            {displayName}
          </div>
        )}

        {filteredStatsArr.length === 0 && !isError && (
          <div style={{ color: "var(--text)", fontSize: "16px", margin: "30px 0" }}>
            스탯 데이터가 없습니다.
          </div>
        )}

        {filteredStatsArr.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {rows.map((row, idx) => (
              <div key={idx} style={{
                display: "grid",
                gridTemplateColumns: `repeat(${colsPerRow}, 1fr)`,
                gap: "16px"
              }}>
                {row.map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      background: "var(--code-bg, #f4f3ec)",
                      borderRadius: "9px",
                      border: "1.5px solid var(--accent-border, #c084fc)",
                      boxShadow: "0 1px 2px 0 rgba(170,59,255,0.07)",
                      padding: "10px 14px",
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: "17px",
                      color: "var(--text-h, #aa3bff)"
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "var(--text, #6b6375)", marginBottom: "2px", wordBreak: "keep-all" }}>
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

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>⚽ FC Lab 선수 검색</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="선수 이름 입력 (예: 손흥민)" 
          value={Name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>

      <hr />

      <h2>검색 결과 ({players.length}명)</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((player) => (
          <li
            key={player.id}
            style={{
              margin: '10px 0',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px 14px',
              borderRadius: '7px',
              background: selectedPlayer && selectedPlayer.id === player.id
                ? "var(--accent-bg, #f4f3ec)"
                : "transparent",
              border: selectedPlayer && selectedPlayer.id === player.id
                ? "2px solid var(--accent, #aa3bff)"
                : "2px solid transparent",
              transition: "background 0.2s, border-color 0.2s"
            }}
            onClick={() => handlePlayerClick(player)}
            tabIndex={0}
            onKeyDown={e => (e.key === "Enter" ? handlePlayerClick(player) : null)}
          >
            <strong>{player.name}</strong> (spid: {player.id})
          </li>
        ))}
      </ul>

      {selectedPlayer && (
        <div style={{
          marginTop: "36px",
          maxWidth: "480px",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--accent-bg, #f4f3ec), #fff 65%)",
              borderRadius: "16px",
              boxShadow: "0 8px 25px -7px var(--shadow, #c084fc55)",
              padding: "28px 30px 24px 30px",
              minHeight: "160px",
              textAlign: "center",
              border: "2.8px solid var(--accent-border, #c084fc77)"
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <span style={{ fontWeight: 700, fontSize: "23px", color: "var(--accent, #aa3bff)" }}>
                {selectedPlayer.name}
              </span>
              <span style={{
                fontSize: "13px",
                fontWeight: 400,
                marginLeft: "12px",
                color: "var(--text, #6b6375)"
              }}>
                (SPID: {selectedPlayer.id})
              </span>
            </div>
            {statLoading ? (
              <div style={{ fontSize: "18px", color: "var(--accent)", fontWeight: 500, marginTop: "25px" }}>
                스탯 불러오는 중...
              </div>
            ) : playerStats ? (
              renderStatsGrid(playerStats)
            ) : (
              <div style={{ fontSize: "15px", color: "var(--text)" }}>
                상세 스탯을 불러옵니다. (잠시만 기다려주세요)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App