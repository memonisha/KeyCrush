import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbapcspsewyxahhlgodg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iYXBjc3BzZXd5eGFoaGxnb2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzQzMTQsImV4cCI6MjA2NTExMDMxNH0.6DPA6ROGR0hJ-1SCpF6R50roJ7Vur4t2sQmTmZyCw60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);