import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ikretockhrmjwwejfxbj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcmV0b2NraHJtand3ZWpmeGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzY3MTAsImV4cCI6MjA3NjkxMjcxMH0.r_9PORcidHpCzfrXAFq1J1K6koxoEPGAEB1WbNh8004';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);