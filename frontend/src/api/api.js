import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

// 선수검색
export async function searchPlayersByName(name) {
  const { data } = await api.get(`/api/players/search?name=${encodeURIComponent(name)}`)
  return data
}

// 선수 능력치 조회
export async function getPlayerAbility(spid) {
  const { data } = await api.get(`/api/players/ability/${spid}`)
  return data
}

export const savedPlayerApi = {
  // 1. 보관함 조회 (GET)
  getSavedPlayers: async (memberId) => {
      const response = await api.get(`/api/saved-players`, {
          params: { memberId },
      })
      return response.data // List<SavedPlayerResponse> 반환
  },

  // 2. 선수 저장 (POST)
  savePlayer: async (memberId, requestData) => {
      const response = await api.post(`/api/saved-players`, requestData, {
          params: { memberId },
      })
      return response.data // 저장된 ID 반환
  },

  // 3. 선수 삭제 (DELETE)
  deletePlayer: async (memberId, savedPlayerId) => {
      const response = await api.delete(`/api/saved-players/${savedPlayerId}`, {
          params: { memberId },
      })
      return response.data
  }
}