import axios from 'axios'

/** 우리 백엔드 베이스 URL — 포트/호스트 변경 시 이 값만 수정하면 됩니다. */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export async function searchPlayersByName(name) {
  const { data } = await api.get(`/api/players/search?name=${encodeURIComponent(name)}`)
  return data
}

export async function getPlayerAbility(spid) {
  const { data } = await api.get(`/api/players/ability/${spid}`)
  return data
}
