import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FlashcardDeck } from './FlashcardDeck';

describe('FlashcardDeck', () => {
  it('renders initial flashcard with word and part of speech', () => {
    render(<FlashcardDeck />);
    expect(screen.getByText('Card 1 of 4')).toBeInTheDocument();
    expect(screen.getByText('Ephemeral')).toBeInTheDocument();
    expect(screen.getByText('adjective')).toBeInTheDocument();
  });

  it('flips the card to reveal definition when clicked', () => {
    render(<FlashcardDeck />);
    const card = screen.getByRole('button', { name: /Flashcard for Ephemeral/i });
    fireEvent.click(card);

    expect(screen.getByText('Definition')).toBeInTheDocument();
    expect(
      screen.getByText(/Lasting for a very short time; transitory/i)
    ).toBeInTheDocument();
  });

  it('navigates to next card when Next is clicked', () => {
    render(<FlashcardDeck />);
    const nextBtn = screen.getByRole('button', { name: /Next card/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Card 2 of 4')).toBeInTheDocument();
    expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
  });

  it('provides mobile-friendly 48px touch targets and tactile active feedback for action buttons', () => {
    render(<FlashcardDeck />);
    const prevBtn = screen.getByRole('button', { name: /Previous card/i });
    const flipBtn = screen.getByRole('button', { name: /Flip Card/i });
    const nextBtn = screen.getByRole('button', { name: /Next card/i });

    expect(prevBtn).toHaveClass('min-h-[48px]');
    expect(flipBtn).toHaveClass('min-h-[48px]');
    expect(nextBtn).toHaveClass('min-h-[48px]');

    expect(prevBtn).toHaveClass('active:scale-[0.98]');
    expect(flipBtn).toHaveClass('active:scale-[0.98]');
    expect(nextBtn).toHaveClass('active:scale-[0.98]');
  });
});
