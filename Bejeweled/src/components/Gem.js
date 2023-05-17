import React from 'react';
import blue from '../assets/images/blue.png';
import brown from '../assets/images/brown.png';
import green from '../assets/images/green.png';
import orange from '../assets/images/orange.png';
import red from '../assets/images/red.png';
import white from '../assets/images/white.png';
import yellow from '../assets/images/yellow.png';
import purple from '../assets/images/purple.png';

const GEMS = {
    1: blue,
    2: brown,
    3: green,
    4: orange,
    5: red,
    6: white,
    7: yellow,
    8: purple,
};

const Gem = ({ type, onClick }) => {
    return (
        <div className="gem" onClick={onClick}>
            <img src={GEMS[type]} alt={`Gem ${type}`} />
        </div>
    );
};

export default Gem;
