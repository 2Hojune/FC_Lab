const isKnownText = (value) => {
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase()
  return normalized !== '' && normalized !== 'unknown' && normalized !== 'null' && normalized !== 'undefined'
}

export default function SearchBar({
  name,
  onNameChange,
  onSearch,
  loading,
  selectedPlayer,
  playerStats,
}) {
  const seasonName = selectedPlayer?.seasonName || playerStats?.seasonName

  return (
    <div style={{ marginBottom: '20px' }}>
      {selectedPlayer && (
        <div style={{ marginBottom: '10px', fontSize: '15px', color: 'var(--text, #6b6375)' }}>
          <strong style={{ color: 'var(--accent, #aa3bff)' }}>{selectedPlayer.name}</strong>
          {isKnownText(seasonName) ? ` · ${seasonName}` : ''}
        </div>
      )}
      <input
        type="text"
        placeholder="선수 이름 입력 (예: 손흥민)"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
      />
      <button
        type="button"
        onClick={onSearch}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {loading ? '검색 중...' : '검색'}
      </button>
    </div>
  )
}
