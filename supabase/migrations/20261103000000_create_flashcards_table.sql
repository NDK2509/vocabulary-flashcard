-- Create public flashcards table
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  part_of_speech TEXT DEFAULT 'noun',
  example TEXT,
  review_count INT DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- 1. SELECT policy (users can view their own cards)
CREATE POLICY "Users can select their own flashcards"
ON public.flashcards
FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

-- 2. INSERT policy (users can insert cards belonging to them)
CREATE POLICY "Users can insert their own flashcards"
ON public.flashcards
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

-- 3. UPDATE policy (requires both USING and WITH CHECK per Supabase security guidelines)
CREATE POLICY "Users can update their own flashcards"
ON public.flashcards
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- 4. DELETE policy (users can delete their own cards)
CREATE POLICY "Users can delete their own flashcards"
ON public.flashcards
FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);

