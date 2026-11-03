import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { query } from '@/lib/db';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if flashcards table exists in public schema, or return sample data
    const tableExists = await query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'flashcards'
      );
    `);

    if (tableExists[0]?.exists) {
      const rows = await query('SELECT * FROM public.flashcards WHERE user_id = $1 ORDER BY created_at DESC', [
        user.id,
      ]);
      return NextResponse.json({ flashcards: rows });
    }

    // Default response if table is not migrated yet
    return NextResponse.json({
      flashcards: [],
      message: 'Flashcards table not yet created. Run migration to enable persistent storage.',
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Database query error';
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { word, definition, partOfSpeech, example } = body;

    if (!word || !definition) {
      return NextResponse.json(
        { error: 'Word and definition are required fields' },
        { status: 400 }
      );
    }

    // Attempt insert into public.flashcards if created
    const inserted = await query(
      `INSERT INTO public.flashcards (user_id, word, definition, part_of_speech, example)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [user.id, word, definition, partOfSpeech ?? 'noun', example ?? '']
    );

    return NextResponse.json({ flashcard: inserted[0] }, { status: 201 });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Insert error';
    return NextResponse.json({ error }, { status: 500 });
  }
}

