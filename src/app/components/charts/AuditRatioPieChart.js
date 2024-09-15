import React from 'react'

export function AuditRatioPieChart({ auditRatio }) {
    const diameter = 100
    const textMargin = 100
    const fontSize = 16

    const total = auditRatio[0] + auditRatio[1]
    const radius = diameter/2
    const width = diameter+textMargin*2
    const dashArray = auditRatio[1] * radius * 3.14 / total
    const dashArrayString = dashArray + " " + (radius*3.14)
    const transform = "rotate(-90) translate(-"+(width/2+radius)+","+(textMargin)+")"
    return (
        <svg height={diameter} width={width}>
            <text x="0" y={radius+fontSize/2} fontSize={fontSize}>⬆: {auditRatio[0]} B</text>
            <text x={width-textMargin+5} y={radius+fontSize/2} fontSize={fontSize}>⬇: {auditRatio[1]} B</text>
            <circle r={radius} cx={width/2} cy={radius} fill="white" />
            <circle r={radius/2} cx={width/2} cy={radius}  fill="transparent"
                stroke="tomato"
                strokeWidth={radius}
                strokeDasharray={dashArrayString}
                transform={transform }/>
            <text x={width/2-10} y={radius+fontSize/2} fontSize={fontSize} fontWeight="bold">{auditRatio[2].toFixed(2)}</text>
        </svg>
    )
}