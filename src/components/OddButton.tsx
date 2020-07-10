import React from 'react';
import './OddButton.css';

export const OddButton: React.FC<{
    onClick: (event: any) => void
}> = ({ children, onClick }) => {
    return (
        <button onClick={onClick}><span>{children}</span></button>
    )
}