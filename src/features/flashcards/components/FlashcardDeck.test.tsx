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
    const card = screen.getByRole('button', { name: /Ephemeral/i });
    fireEvent.click(card);

    expect(screen.getByText('Definition')).toBeInTheDocument();
    expect(
      screen.getByText(/Lasting for a very short time; transitory/i)
    ).toBeInTheDocument();
  });

  it('navigates to next card when Next is clicked', () => {
    render(<FlashcardDeck />);
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Card 2 of 4')).toBeInTheDocument();
    expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
  });
});

