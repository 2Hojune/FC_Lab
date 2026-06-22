export function getCompareAdvantage(value, allValues) {
    const valid = allValues.filter((v) => v != null && !Number.isNaN(v))
    if (valid.length < 2 || value == null || Number.isNaN(value)) return null

    const max = Math.max(...valid)
    const min = Math.min(...valid)

    if (value === max && max > min) {
        return max - min
    }

    return null
}
