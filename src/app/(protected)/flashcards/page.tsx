import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FlashcardDeck } from '@/features/flashcards/components/FlashcardDeck';

export const dynamic = 'force-dynamic';

export default async function FlashcardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/flashcards');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Vocabulary Study Session</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Review your vocabulary words using interactive flashcards.
        </p>
      </div>

      <FlashcardDeck />
    </div>
  );
}
