import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Hand from '../components/Hand';
import calculateScore from '../utils/calculateScore';
import App from '../App';

describe('Hand component', () => {
  const cards = [
    { suit: 'spades', value: 'A' },
    { suit: 'clubs', value: 'J' },
  ];
  const score = 21;
  const target = 'player';

  it('should render the hand with cards', () => {
    render(<Hand cards={cards} score={score} target={target} />);

    const cardElements = screen.getAllByTestId('card');
    expect(cardElements).toHaveLength(cards.length);
  });

  it('should render the hand without cards when given an empty array', () => {
    render(<Hand cards={[]} score={score} target={target} />);

    const cardElements = screen.queryAllByTestId('card');
    expect(cardElements).toHaveLength(0);
  });
});

describe('calculateScore function', () => {
  it('should return the correct score for a hand without Aces', () => {
    const cards = [
      { value: '2', hidden: false },
      { value: 'J', hidden: false },
      { value: '8', hidden: false },
    ];
    const score = calculateScore(cards);
    expect(score).toBe(20);
  });

  it('should return the correct score for a hand with an Ace', () => {
    const cards = [
      { value: 'A', hidden: false },
      { value: 'K', hidden: false },
    ];
    const score = calculateScore(cards);
    expect(score).toBe(21);
  });

  it('should return the correct score for a hand with multiple Aces', () => {
    const cards = [
      { value: 'A', hidden: false },
      { value: '3', hidden: false },
      { value: 'A', hidden: false },
    ];
    const score = calculateScore(cards);
    expect(score).toBe(15);
  });

  it('should not consider hidden cards in the score calculation', () => {
    const cards = [
      { value: '10', hidden: true },
      { value: 'A', hidden: false },
    ];
    const score = calculateScore(cards);
    expect(score).toBe(11);
  });

  it('should return 0 if no cards are provided', () => {
    const cards = [];
    const score = calculateScore(cards);
    expect(score).toBe(0);
  });
});

describe('App', () => {
  const setup = () => {
    render(<App />);

    const inputElement = screen.getByLabelText('Place your bet:');
    const buttonElement = screen.getByRole('button', {name: /Bet/i});

    fireEvent.change(inputElement, { target: { value: '30' } });
    fireEvent.click(buttonElement);
  }

  it('should not render the welcome message after betting', () => {
    setup();

    const messageElement = screen.queryByText(/Welcome to React Blackjack! Place your bet to begin./i);
    expect(messageElement).toBeNull();
  });

  it('should render the hand components for the player and dealer correctly', () => {
    setup();

    const dealerHand = screen.getByTestId('dealer-hand');
    const playerHand = screen.getByTestId('player-hand');
    expect(dealerHand).toBeInTheDocument();
    expect(playerHand).toBeInTheDocument();

  });

  it('should deal the cards in their correct sequence to player and dealer when a bet is placed', () => {
    setup();

    const dealerHand = screen.getByTestId('dealer-hand');
    const playerHand = screen.getByTestId('player-hand');
    const cardElements = screen.getAllByTestId('card');
    expect(cardElements).toHaveLength(4);
    expect(dealerHand).toContainElement(cardElements[0]);
    expect(dealerHand).toContainElement(cardElements[1]);
    expect(playerHand).toContainElement(cardElements[2]);
    expect(playerHand).toContainElement(cardElements[3]);
  });

  it('should hide the dealer\'s hole card', () => {
    setup();

    const dealerHand = screen.getByTestId('dealer-hand');
    const hiddenCard = screen.getAllByTestId('card')[0];
    expect(dealerHand).toContainElement(hiddenCard);
    expect(hiddenCard).toHaveClass('card hiddenCard');
  });

  it('should display the player and dealer scores after the cards are dealt', () => {
    setup();

    const dealerScore = screen.getByTestId('dealer-score');
    const playerScore = screen.getByTestId('player-score');
    expect(dealerScore).toBeInTheDocument();
    expect(playerScore).toBeInTheDocument();
  });
});
