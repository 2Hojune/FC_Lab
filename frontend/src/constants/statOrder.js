export const STAT_ORDER = [
    '속력', '가속력', '골 결정력', '슛 파워', '중거리 슛', '위치 선정',
    '발리슛', '페널티 킥', '짧은 패스', '시야', '크로스', '긴 패스',
    '프리킥', '커브', '드리블', '볼 컨트롤', '민첩성', '밸런스',
    '반응 속도', '대인 수비', '태클', '가로채기', '헤더', '슬라이딩 태클',
    '몸싸움', '스태미너', '적극성', '점프', '침착성',
    'GK 다이빙', 'GK 핸들링', 'GK 킥', 'GK 반응속도', 'GK 위치 선정',
]

const normalizeKey = (key) => key.replace(/\s+/g, '')

// API 응답 스탯명 ↔ STAT_ORDER 명칭 차이 보정
const ORDER_ALIASES = {
    '드리블': ['드리블링'],
    '발리슛': ['발리'],
    '반응속도': ['반응속도'],
    '가로채기': ['인터셉트'],
    '스태미너': ['체력'],
    '슬라이딩태클': ['슬라이딩 태클'],
}

function findStatEntry(orderKey, available, usedKeys) {
    const candidates = [orderKey, ...(ORDER_ALIASES[normalizeKey(orderKey)] ?? [])]

    for (const candidate of candidates) {
        const entry = available.get(normalizeKey(candidate))
        if (entry && !usedKeys.has(entry[0])) {
            return entry
        }
    }

    return null
}

export function getOrderedStatEntries(stats) {
    if (!stats) return []

    const available = new Map()
    for (const [key, value] of Object.entries(stats)) {
        if (key === 'name' || key === 'error') continue
        const parsed = Number.parseInt(String(value), 10)
        if (Number.isNaN(parsed)) continue
        available.set(normalizeKey(key), [key, value])
    }

    const ordered = []
    const usedKeys = new Set()

    for (const orderKey of STAT_ORDER) {
        const entry = findStatEntry(orderKey, available, usedKeys)
        if (entry) {
            ordered.push(entry)
            usedKeys.add(entry[0])
        }
    }

    for (const [key, value] of Object.entries(stats)) {
        if (usedKeys.has(key) || key === 'name' || key === 'error') continue
        const parsed = Number.parseInt(String(value), 10)
        if (!Number.isNaN(parsed)) {
            ordered.push([key, value])
        }
    }

    return ordered
}

export function getStatValue(stats, orderKey) {
    if (!stats) return null

    const available = buildStatMap(stats)
    const candidates = [orderKey, ...(ORDER_ALIASES[normalizeKey(orderKey)] ?? [])]

    for (const candidate of candidates) {
        const value = available.get(normalizeKey(candidate))
        if (value !== undefined) return value
    }

    return null
}

function buildStatMap(stats) {
    const map = new Map()
    if (!stats) return map

    for (const [key, value] of Object.entries(stats)) {
        if (key === 'name' || key === 'error') continue
        const parsed = Number.parseInt(String(value), 10)
        if (Number.isNaN(parsed)) continue
        map.set(normalizeKey(key), parsed)
    }

    return map
}

export function getOrderedStatEntriesWithDelta(appliedStats, baseStats) {
    const baseMap = buildStatMap(baseStats)

    return getOrderedStatEntries(appliedStats).map(([key, value]) => {
        const applied = Number.parseInt(String(value), 10)
        const base = baseMap.get(normalizeKey(key)) ?? applied

        return {
            key,
            value: applied,
            delta: applied - base,
        }
    })
}
