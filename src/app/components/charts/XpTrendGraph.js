import React from 'react'
import { useState } from 'react'

export function XpTrendGraph({ xpTrend }) {
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
    const cumSum = []
    const xLim = xpTrend.length
    const yLim = xpTrend.reduce((accum, current) => {
        accum = accum + current[1]
        cumSum.push(accum)
        return accum
    }, 0)

    const xScale = (index) => (index / xLim) * chartWidth + xMargin;
    const yScale = (value) => (1 - (value / yLim)) * chartHeight + topMargin;

    const points = cumSum.map((d, i) => `${xScale(i)},${yScale(d)}`).join(' ');

    let prevLabelPos = 0

    
    return (
        <svg height={height} width={width}>
        <line x1={xMargin} y1={topMargin} x2={xMargin} y2={height - yMargin} stroke="#000000" strokeWidth="2" />
        <line x1={xMargin} y1={height - yMargin} x2={width - rightMargin} y2={height - yMargin} stroke="#000000" strokeWidth="2" />
        <text x={xMargin - fontSize*1} y={topMargin - fontSize*1} fontSize={fontSizeBig}>XP</text>
        <text x={xMargin - `${yLim}`.length * fontSizeBig*0.6} y={fontSizeBig + topMargin} fontSize={fontSizeBig}>{yLim}</text>
        <text x={xMargin - fontSizeBig} y={height - yMargin} fontSize={fontSizeBig}>0</text>
        <polyline
            fill="none"
            stroke="#0074d9"
            strokeWidth="1"
            points={points}
        />
        
        {xpTrend.map((d, i) => {
            if (xScale(i)-prevLabelPos > fontSize || i===0) {
                prevLabelPos = xScale(i)
                return(
                    <g key={i} transform={`translate(${fontSize+xScale(i)},${height - fontSize})`}>
                        <text fontSize={fontSize} transform={`rotate(-90)`}>{d[0].substring(Math.max(0,d[0].length-30),d[0].length)}</text>
                    </g>
            )
            }
        })}

        {cumSum.map((d, i) => {
            return (
                <circle
                    key={i}
                    cx={xScale(i)}
                    cy={yScale(d)}
                    r="3"
                    fill="#0074d9"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                />)
        })}
        {hoveredPoint && (
            <g transform={`translate(${xScale(hoveredPoint)},${yScale(cumSum[hoveredPoint])})`}>
                <rect x="-140" y="0" width="280" height="40" fill="white" stroke="#0074d9" />
                <text x="0" y="32" textAnchor="middle" fill="#0074d9" fontSize={fontSizeBig}>
                    XP: {xpTrend[hoveredPoint][1]}
                </text>
                <text x="0" y="17" textAnchor="middle" fill="#0074d9" fontSize={fontSizeBig}>
                    Project: {xpTrend[hoveredPoint][0].substring(Math.max(0,xpTrend[hoveredPoint][0].length-30),xpTrend[hoveredPoint][0].length)}
                </text>
            </g>
        )}
        </svg>
    )
}