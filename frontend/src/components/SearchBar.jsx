export default function SearchBar({ name, onNameChange, onSearch, loading }) {
  return (
    <div style={{ marginBottom: '20px' }}>
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
