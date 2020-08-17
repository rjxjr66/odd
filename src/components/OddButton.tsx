import React from 'react';
import './OddButton.scss';

export const OddButton: React.FC<{
    onClick: (event: any) => void
}> = ({ children, onClick }) => {
    return (
        <button className="OddButton" onClick={onClick}><span>{children}</span></button>
    )
}