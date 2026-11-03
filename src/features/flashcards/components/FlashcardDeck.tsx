'use client';

import { useState } from 'react';

interface Flashcard {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
}

const SAMPLE_CARDS: Flashcard[] = [
  {
    id: '1',
    word: 'Ephemeral',
    partOfSpeech: 'adjective',
    definition: 'Lasting for a very short time; transitory.',
    example: 'The ephemeral bloom of the cherry blossoms lasted only a few days.',
  },
  {
    id: '2',
    word: 'Ubiquitous',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere.',
    example: 'Smartphones have become ubiquitous in modern society.',
  },
  {
    id: '3',
    word: 'Pragmatic',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically in a practical way.',
    example: 'They made a pragmatic decision based on available resources.',
  },
  {
    id: '4',
    word: 'Resilient',
    partOfSpeech: 'adjective',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    example: 'The team remained resilient despite multiple setbacks.',
  },
];

export function FlashcardDeck() {
  const [cards] = useState<Flashcard[]>(SAMPLE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center space-y-6">
      <div className="text-sm font-medium text-gray-500">
        Card {currentIndex + 1} of {cards.length}
      </div>

      {/* Flashcard container */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleFlip}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
        className="w-full h-80 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm transition hover:shadow-md select-none"
      >
        {!isFlipped ? (
          <div className="space-y-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full">
              {currentCard.partOfSpeech}
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight">{currentCard.word}</h2>
            <p className="text-xs text-gray-400 pt-4">Click or press Space to reveal definition</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Definition</h3>
            <p className="text-lg text-gray-800 dark:text-gray-200">{currentCard.definition}</p>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm text-gray-500 italic">&ldquo;{currentCard.example}&rdquo;</p>
            </div>
            <p className="text-xs text-gray-400 pt-2">Click to flip back</p>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handlePrev}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleFlip}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
        >
          Flip Card
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

