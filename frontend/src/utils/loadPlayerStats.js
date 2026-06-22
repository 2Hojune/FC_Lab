import { getPlayerAbility } from '../api/api'
import { calculateAppliedStats, hasAbilityStats, normalizeFocusTraining } from './applyPlayerStats'

export async function loadPlayerStats(player) {
    const fetchedBaseStats = await getPlayerAbility(player.spid)

    if (!hasAbilityStats(fetchedBaseStats)) {
        return { error: `spid(${player.spid}) 능력치를 불러오지 못했습니다.` }
    }

    const focusTraining = normalizeFocusTraining(player.focusTraining, fetchedBaseStats)
    const stats = calculateAppliedStats(fetchedBaseStats, { ...player, focusTraining })

    return {
        player,
        stats,
        baseStats: fetchedBaseStats,
        focusTraining,
    }
}
