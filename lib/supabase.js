import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rldpcgglgsxvowgoafxy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZHBjZ2dsZ3N4dm93Z29hZnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzA3MjAsImV4cCI6MjA4OTUwNjcyMH0.Y83WIbQAoYjitu0fd733W___oMRoU5Zo-uDc3QNGjWw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
