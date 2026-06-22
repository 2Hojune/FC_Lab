import { getCompareAdvantage } from '../utils/compareStats'

export default function CompareStatValue({ value, compareValues, baseDelta = 0, size = 'md' }) {
    if (value == null) return <span style={{ color: '#aaa' }}>-</span>

    const advantage = compareValues ? getCompareAdvantage(value, compareValues) : null
    const fontSize = size === 'lg' ? '22px' : '17px'

    return (
        <span style={{ fontWeight: 600, fontSize }}>
            {advantage != null && (
                <span style={{ marginRight: '6px', fontSize: size === 'lg' ? '14px' : '14px', color: '#2e7d32', fontWeight: 700 }}>
                    +{advantage}
                </span>
            )}
            {value}
            {!compareValues && baseDelta > 0 && (
                <span style={{ marginLeft: '6px', fontSize: '14px', color: '#2e7d32', fontWeight: 700 }}>
                    +{baseDelta}
                </span>
            )}
        </span>
    )
}
