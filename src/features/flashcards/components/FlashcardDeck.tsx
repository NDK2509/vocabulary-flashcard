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
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-5 sm:space-y-6">
      <div className="text-xs sm:text-sm font-medium text-gray-500">
        Card {currentIndex + 1} of {cards.length}
      </div>

      {/* Flashcard container */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label={
          isFlipped
            ? `Flashcard for ${currentCard.word}, currently showing definition: ${currentCard.definition}. Tap or press Space to flip.`
            : `Flashcard for ${currentCard.word}. Tap or press Space to reveal definition.`
        }
        className="w-full min-h-[280px] sm:min-h-[340px] bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs transition duration-150 active:scale-[0.99] hover:shadow-md select-none"
      >
        {!isFlipped ? (
          <div className="space-y-3 max-w-full">
            <span className="inline-block text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full">
              {currentCard.partOfSpeech}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight break-words">
              {currentCard.word}
            </h2>
            <p className="text-xs text-gray-400 pt-3 sm:pt-4">
              Tap card or press Space to reveal definition
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-full">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
              Definition
            </h3>
            <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 break-words leading-relaxed">
              {currentCard.definition}
            </p>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-gray-500 italic break-words">
                &ldquo;{currentCard.example}&rdquo;
              </p>
            </div>
            <p className="text-xs text-gray-400 pt-1 sm:pt-2">Tap card to flip back</p>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4 sm:justify-center">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous card"
          className="flex-1 sm:flex-initial min-h-[48px] px-3.5 sm:px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleFlip}
          aria-label="Flip Card"
          className="flex-1 sm:flex-initial min-h-[48px] px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold active:scale-[0.98] transition shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Flip Card
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next card"
          className="flex-1 sm:flex-initial min-h-[48px] px-3.5 sm:px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
