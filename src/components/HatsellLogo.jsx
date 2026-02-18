import React from 'react';

export default function HatsellLogo({ small }) {
    const cx = 100;
    const cy = 100;
    const color = '#7b2d3b';

    const toRad = (d) => (d * Math.PI) / 180;

    const arcPath = (r, startDeg, endDeg) => {
        const x1 = cx + r * Math.cos(toRad(startDeg));
        const y1 = cy + r * Math.sin(toRad(startDeg));
        const x2 = cx + r * Math.cos(toRad(endDeg));
        const y2 = cy + r * Math.sin(toRad(endDeg));
        const largeArc = endDeg - startDeg > 180 ? 1 : 0;
        return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    const seatDots = (r, startDeg, endDeg, count, size, opacity) => {
        const step = (endDeg - startDeg) / (count + 1);
        return Array.from({ length: count }).map((_, i) => {
            const deg = startDeg + step * (i + 1);
            const x = cx + r * Math.cos(toRad(deg));
            const y = cy + r * Math.sin(toRad(deg));
            return (
                <rect
                    key={`${r}-${deg}`}
                    x={x - size / 2}
                    y={y - size / 2}
                    width={size}
                    height={size}
                    rx={0.5}
                    fill={color}
                    opacity={opacity}
                    transform={`rotate(${deg} ${x} ${y})`}
                />
            );
        });
    };

    const sections = [
        { start: -80, end: -35 }, { start: -25, end: 20 }, { start: 30, end: 75 },
        { start: 100, end: 145 }, { start: 155, end: 200 }, { start: 210, end: 255 },
    ];

    const rings = [
        { r: 38, seats: 5, size: 2.8, opacity: 0.25 },
        { r: 48, seats: 7, size: 3, opacity: 0.3 },
        { r: 58, seats: 8, size: 3.2, opacity: 0.3 },
        { r: 68, seats: 10, size: 3.2, opacity: 0.28 },
        { r: 78, seats: 11, size: 3.4, opacity: 0.25 },
    ];

    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            className={small ? 'logo-small' : undefined}>
            <circle cx={cx} cy={cy} r="92" stroke={color} strokeWidth="1" opacity="0.18" />
            <circle cx={cx} cy={cy} r="90" stroke={color} strokeWidth="0.5" opacity="0.1" />
            <circle cx={cx} cy={cy} r="22" stroke={color} strokeWidth="1" opacity="0.2" fill={color} fillOpacity="0.04" />
            <rect x={cx - 8} y={cy - 6} width="16" height="5" rx="1" stroke={color} strokeWidth="0.8" opacity="0.3" fill={color} fillOpacity="0.06" />
            <rect x={cx - 3} y={cy + 4} width="6" height="4" rx="1" fill={color} opacity="0.2" />

            {sections.map((sec) => rings.map((ring) => (
                <path
                    key={`arc-${sec.start}-${ring.r}`}
                    d={arcPath(ring.r, sec.start, sec.end)}
                    stroke={color}
                    strokeWidth="0.6"
                    opacity={0.12}
                    fill="none"
                />
            )))}

            {sections.map((sec) => rings.map((ring) =>
                seatDots(ring.r, sec.start, sec.end, ring.seats, ring.size, ring.opacity)
            ))}
        </svg>
    );
}
