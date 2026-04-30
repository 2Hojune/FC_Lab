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

export async function savePlayerPreset(presetName, playersData) {
  // 백엔드의 PresetSaveRequest 구조와 똑같이 생긴 객체를 만듭니다.
  const payload = {
    presetName: presetName,
    players: playersData // 프론트에서 세팅한 선수들의 배열 [{ spid: 100, grade: 8... }, ...]
  };

  // 💡 데이터를 '생성'하는 것이므로 api.get 이 아니라 api.post 를 사용합니다!
  const { data } = await api.post(`/api/presets`, payload);
  
  return data;
}

