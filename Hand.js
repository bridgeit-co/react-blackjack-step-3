import React from 'react';
import Card from './Card';
import '../styles/hand.css';

export default function Hand(props) {
  // Destructure the props

  return (
    <div className='grid-container' data-testid={`${target.toLowerCase()}-hand`}>
      <div className="card-container">
        {/* Map over the cards array and render a Card component for each card */}
      </div>
      {score > 0 && <h1 className="score" data-testid={`${target.toLowerCase()}-score`}>{target}: {score}</h1>}
    </div>
  );
}
