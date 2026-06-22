const SKIP_KEYS = new Set(['name', 'error', 'focusTraining'])

export function hasAbilityStats(stats) {
    if (!stats || stats.error) return false

    return Object.entries(stats).some(([key, value]) => {
        if (SKIP_KEYS.has(key)) return false
        const parsed = Number.parseInt(String(value), 10)
        return !Number.isNaN(parsed)
    })
}

// 집중훈련 키(영문) → 넥슨 API 스탯명(한글) 매핑
const FOCUS_TRAINING_KEY_MAP = {
    speed: '속력',
    acceleration: '가속력',
    sprint: '스프린트 속력',
    shotPower: '슛 파워',
    finishing: '골 결정력',
    longShot: '중거리 슛',
    volley: '발리',
    penalty: '페널티 킥',
    freeKick: '프리킥',
    cornerKick: '코너킥',
    dribble: '드리블링',
    ballControl: '볼 컨트롤',
    agility: '민첩성',
    balance: '밸런스',
    reaction: '반응속도',
    tackle: '태클',
    slidingTackle: '슬라이딩 태클',
    intercept: '인터셉트',
    heading: '헤더',
    jump: '점프',
    stamina: '체력',
}

function getEnhancementBonus(grade) {
    if (grade <= 1) return 0
    let bonus = 0
    for (let g = 2; g <= grade; g++) {
        bonus += g >= 5 ? 2 : 1
    }
    return bonus
}

function getAdaptabilityBonus(adaptability) {
    return adaptability >= 5 ? 2 : Math.max(0, adaptability - 1)
}

export const FOCUS_TRAINING_MIN = 0
export const FOCUS_TRAINING_MAX = 2

function resolveFocusTrainingKey(statKey, stats) {
    if (stats[statKey] !== undefined) return statKey
    const mapped = FOCUS_TRAINING_KEY_MAP[statKey]
    if (mapped && stats[mapped] !== undefined) return mapped
    return null
}

export function normalizeFocusTraining(focusTraining, baseStats) {
    if (!focusTraining || !baseStats) return {}

    const normalized = {}
    for (const [key, rawValue] of Object.entries(focusTraining)) {
        const resolvedKey = resolveFocusTrainingKey(key, baseStats)
        if (!resolvedKey) continue

        const value = Math.min(
            FOCUS_TRAINING_MAX,
            Math.max(FOCUS_TRAINING_MIN, Number(rawValue) || 0)
        )
        if (value > 0) {
            normalized[resolvedKey] = value
        }
    }

    return normalized
}

export function clampFocusTrainingValue(value) {
    return Math.min(FOCUS_TRAINING_MAX, Math.max(FOCUS_TRAINING_MIN, Number(value) || 0))
}

export function calculateAppliedStats(baseStats, player) {
    if (!baseStats || baseStats.error) return baseStats

    const gradeBonus = getEnhancementBonus(Number(player.grade))
    const adaptBonus = getAdaptabilityBonus(Number(player.adaptability))
    const commonBonus = gradeBonus + adaptBonus

    const result = {}

    for (const [key, value] of Object.entries(baseStats)) {
        if (SKIP_KEYS.has(key)) {
            result[key] = value
            continue
        }

        const base = Number.parseInt(String(value), 10)
        if (Number.isNaN(base)) {
            result[key] = value
            continue
        }

        result[key] = base + commonBonus
    }

    if (player.focusTraining) {
        for (const [statKey, bonusValue] of Object.entries(player.focusTraining)) {
            const resolvedKey = resolveFocusTrainingKey(statKey, result)
            if (!resolvedKey) continue
            const current = Number.parseInt(String(result[resolvedKey]), 10)
            if (!Number.isNaN(current)) {
                result[resolvedKey] = current + Number(bonusValue)
            }
        }
    }

    return result
}
