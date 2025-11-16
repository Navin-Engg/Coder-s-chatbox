-- Create conversations table to store chat sessions
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table to store individual chat messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  is_coding_related BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create coding_resources table to store helpful resources
CREATE TABLE IF NOT EXISTS public.coding_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations (public access for demo)
CREATE POLICY "Anyone can view conversations"
  ON public.conversations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update conversations"
  ON public.conversations FOR UPDATE
  USING (true);

-- RLS Policies for messages (public access for demo)
CREATE POLICY "Anyone can view messages"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- RLS Policies for coding_resources (public read access)
CREATE POLICY "Anyone can view coding resources"
  ON public.coding_resources FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create coding resources"
  ON public.coding_resources FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coding_resources_topic ON public.coding_resources(topic);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial coding resources
INSERT INTO public.coding_resources (topic, url, title, description, language) VALUES
  ('JavaScript Basics', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'MDN JavaScript Guide', 'Comprehensive JavaScript documentation and tutorials', 'JavaScript'),
  ('Python Documentation', 'https://docs.python.org/3/', 'Official Python Docs', 'Official Python documentation', 'Python'),
  ('React Tutorial', 'https://react.dev/learn', 'React Official Tutorial', 'Learn React from the official docs', 'JavaScript'),
  ('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'TypeScript Handbook', 'Complete TypeScript guide', 'TypeScript'),
  ('CSS-Tricks', 'https://css-tricks.com/', 'CSS-Tricks', 'CSS tips, tricks, and techniques', 'CSS'),
  ('Stack Overflow', 'https://stackoverflow.com/', 'Stack Overflow', 'Q&A for developers', 'All'),
  ('GitHub Docs', 'https://docs.github.com/', 'GitHub Documentation', 'Learn about Git and GitHub', 'Git'),
  ('Node.js Docs', 'https://nodejs.org/docs/latest/api/', 'Node.js Documentation', 'Official Node.js API reference', 'JavaScript'),
  ('Vue.js Guide', 'https://vuejs.org/guide/introduction.html', 'Vue.js Guide', 'Progressive JavaScript framework', 'JavaScript'),
  ('Rust Book', 'https://doc.rust-lang.org/book/', 'The Rust Programming Language', 'Learn Rust programming', 'Rust')
ON CONFLICT DO NOTHING;