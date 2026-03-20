import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbhaoclepfbyrvhkxite.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iaGFvY2xlcGZieXJ2aGt4aXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzczNzAsImV4cCI6MjA4OTMxMzM3MH0.gsiZ4NTgyu1Ly4bgwMz-PNwLj-ZzyR-IQ3LaaChl6LI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
