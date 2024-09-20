import React from 'react'
import { useState } from 'react'

export function PassTrendGraph({ passTrend, graphFilter }) {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const width = 1000
    const height = 500
    const xMargin = 170
    const yMargin = 150
    const rightMargin = 150
    const topMargin = 50
    const fontSize = 9
    const fontSizeBig = 14
    const chartWidth = width - xMargin - rightMargin
    const chartHeight = height - yMargin - topMargin

    if (graphFilter) {
        passTrend = passTrend.filter((val) => val[2]===graphFilter)
    }

    passTrend = passTrend.map((val) => [val[0].slice(9),val[1]])

    const xLim = passTrend.length
    const yLim = 1
    let failCount = 0
    let passCount = 0
    passTrend.forEach((current) => {
        current[1] > 0 ? passCount++ : failCount++
    }, 0)

    const xScale = (index) => (index / xLim) * chartWidth + xMargin;
    const yScale = (value) => (1 - (Math.min(value,1) / yLim)) * chartHeight + topMargin;


    let prevLabelPos = 0
    
    return (
        <svg height={height} width={width}>
        <line x1={xMargin} y1={topMargin} x2={xMargin} y2={height - yMargin} stroke="#000000" strokeWidth="2" />
        <line x1={xMargin} y1={height - yMargin} x2={width - rightMargin} y2={height - yMargin} stroke="#000000" strokeWidth="2" />
        <text x={xMargin - 70} y={fontSizeBig + topMargin} fontSize={fontSizeBig}>Pass: {passCount}</text>
        <text x={xMargin - 60} y={height - yMargin} fontSize={fontSizeBig}>Fail: {failCount}</text>
        
        {passTrend.map((d, i) => {
            if (xScale(i)-prevLabelPos > fontSize || i===0) {
                prevLabelPos = xScale(i)
                return(
                    <g key={i} transform={`translate(${fontSize+xScale(i)},${height - fontSize})`}>
                        <text fontSize={fontSize} transform={`rotate(-90)`}>{d[0].substring(Math.max(0,d[0].length-30),d[0].length)}</text>
                    </g>
            )
            }
        })}

        {passTrend.map((d, i) => {
            return (
                <circle
                    key={i}
                    cx={xScale(i)}
                    cy={yScale(d[1])}
                    r="4"
                    fill="#0074d9"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                />)
        })}
        {hoveredPoint && (
            <g transform={`translate(${xScale(hoveredPoint)},${yScale(passTrend[hoveredPoint][1])})`}>
                <rect x="-140" y="10" width="280" height="40" fill="white" stroke="#0074d9" />
                <text x="0" y="42" textAnchor="middle" fill="#0074d9" fontSize={fontSizeBig}>
                    Grade: {passTrend[hoveredPoint][1]>=1 ? "Pass":"Fail"}
                </text>
                <text x="0" y="27" textAnchor="middle" fill="#0074d9" fontSize={fontSizeBig}>
                    Project: {passTrend[hoveredPoint][0].substring(Math.max(0,passTrend[hoveredPoint][0].length-30),passTrend[hoveredPoint][0].length)}
                </text>
            </g>
        )}
        </svg>
    )
}