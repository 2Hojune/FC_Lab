import { getStatValue } from './statOrder'

export const STAT_CATEGORIES = [
    {
        label: '스피드',
        stats: ['속력', '가속력'],
    },
    {
        label: '슛',
        stats: ['골 결정력', '슛 파워', '중거리 슛', '위치 선정', '발리슛', '페널티 킥'],
    },
    {
        label: '패스',
        stats: ['짧은 패스', '시야', '크로스', '긴 패스', '프리킥', '커브'],
    },
    {
        label: '드리블',
        stats: ['드리블', '볼 컨트롤', '민첩성', '밸런스', '반응 속도'],
    },
    {
        label: '수비',
        stats: ['대인 수비', '태클', '가로채기', '헤더', '슬라이딩 태클'],
    },
    {
        label: '피지컬',
        stats: ['몸싸움', '스태미너', '적극성', '점프', '침착성'],
    },
]

export function getCategoryStatValue(stats, label) {
    const category = STAT_CATEGORIES.find((item) => item.label === label)
    if (!category) return null
    return averageStatValues(stats, category.stats)
}

function averageStatValues(stats, statKeys) {
    const values = statKeys
        .map((key) => getStatValue(stats, key))
        .filter((value) => value !== null)

    if (values.length === 0) return null

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function calculateCategoryStats(appliedStats, baseStats) {
    return STAT_CATEGORIES.map(({ label, stats }) => {
        const value = averageStatValues(appliedStats, stats)
        const baseValue = averageStatValues(baseStats, stats)

        return {
            label,
            value,
            delta: value !== null && baseValue !== null ? value - baseValue : 0,
        }
    }).filter((category) => category.value !== null)
}
