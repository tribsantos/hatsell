import React from 'react';

export default function HatsellLogo({ small, framed = false }) {
    const cx = 100;
    const cy = 100;
    const color = '#7b2d3b';
    const frameRed = '#c0392b';

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

    const sectionCount = 6;
    const sectionWidth = 48;
    const sectionOffset = 6;
    const sectionStep = 360 / sectionCount;
    const sections = Array.from({ length: sectionCount }).map((_, i) => {
        const start = sectionOffset + i * sectionStep;
        return { start, end: start + sectionWidth };
    });

    // Exact spec:
    // - 3 rows per section
    // - outer row: 6 seats
    // - middle row: 5 seats
    // - inner row: 3 seats
    const rings = [
        { r: 68, seats: 6, size: 7, opacity: 0.59 },
        { r: 52, seats: 5, size: 6.5, opacity: 0.63 },
        { r: 36, seats: 3, size: 6, opacity: 0.59 }
    ];

    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            className={small ? 'logo-small' : undefined}>
            {framed && (
                <>
                    <rect width="200" height="200" rx="36" fill={frameRed} />
                    <circle cx={cx} cy={cy} r="84" fill="white" />
                    <circle cx={cx} cy={cy} r="84" stroke={color} strokeWidth="2" opacity="0.6" />
                </>
            )}
            <circle cx={cx} cy={cy} r="84" stroke={color} strokeWidth="1.65" opacity="0.4" />
            <circle cx={cx} cy={cy} r="22" stroke={color} strokeWidth="1.4" opacity="0.4" fill={color} fillOpacity="0.08" />
            <rect x={cx - 11} y={cy - 7} width="22" height="7" rx="2" stroke={color} strokeWidth="1.05" opacity="0.55" fill={color} fillOpacity="0.11" />
            <rect x={cx - 5} y={cy + 4} width="10" height="6" rx="2" fill={color} opacity="0.45" />

            {sections.map((sec) => rings.map((ring) => (
                <path
                    key={`arc-${sec.start}-${ring.r}`}
                    d={arcPath(ring.r, sec.start, sec.end)}
                    stroke={color}
                    strokeWidth="0.9"
                    opacity={0.24}
                    fill="none"
                />
            )))}

            {sections.map((sec) => rings.map((ring) =>
                seatDots(ring.r, sec.start, sec.end, ring.seats, ring.size, ring.opacity)
            ))}
        </svg>
    );
}
