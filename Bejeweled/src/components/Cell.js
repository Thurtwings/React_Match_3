import React from 'react';
import Gem from './Gem';

const Cell = ({ gem, isSelected, onClick, style }) => {
    const handleClick = () => {
        onClick();
    };

    return (
        <div className={`cell ${isSelected ? 'selected' : ''}`} onClick={handleClick} style={style}>
            <Gem type={gem} />
        </div>
    );
};

export default Cell;

