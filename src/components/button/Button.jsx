import React from 'react';
import style from './Button.module.css';

export default function Button({
    type = 'primary',
    size = 'medium',
    disabled = false,
    children,
    onClick,
    ...props
}) {
    return (
        <button
            className={`${style.button} ${style[type]} ${style[size]} ${disabled ? style.disabled : ''} ${ props.unique? style[props.unique] : ''}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}