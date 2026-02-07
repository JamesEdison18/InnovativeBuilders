import React from 'react';

export function Badge({ children, variant = 'gray' }) {
    // variants: blue, green, gray, red, yellow
    const variantMap = {
        blue: { background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' }, // Sky 400 with opacity
        green: { background: 'rgba(52, 211, 153, 0.1)', color: '#34D399' }, // Emerald 400
        gray: { background: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8' }, // Slate 400
        red: { background: 'rgba(248, 113, 113, 0.1)', color: '#F87171' }, // Red 400
        yellow: { background: 'rgba(251, 191, 36, 0.1)', color: '#FBBF24' }, // Amber 400
    };

    const style = variantMap[variant] || variantMap.gray;

    return (
        <span
            className="badge"
            style={{ ...style }}
        >
            {children}
        </span>
    );
}
