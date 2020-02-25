import React from 'react';
import BombSvg from '../../bomb.svg'
import './_cell.css';

const Cell = (props) => {
    const isRevealed = props.isRevealed;
    return (
        <>
            <div id={props.id} className={`grid-cell ${isRevealed && props.value === 'M' ? 'active-bomb' : isRevealed ? 'active' : null}`}  onClick={(event) => props.handleCellClick(event)}>
                <span className={isRevealed && props.value === 'M' ? 'active-bomb' : isRevealed ? 'active' : null} >{props.value === "M" ? <img src={BombSvg} alt="M"/> : props.value !== 0 ? props.value : null}</span>
            </div>    
        </>
    )
}

export default Cell;