import React from 'react';

export function Button({
    children,
    variant = 'primary',
    className = '',
    onClick,
    icon: Icon,
    ...props
}) {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : '';

    return (
        <button
            className={`${baseClass} ${variantClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
}
