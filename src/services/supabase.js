import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mgzrspbagncgrwpvpfqw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nenJzcGJhZ25jZ3J3cHZwZnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzIwNjMsImV4cCI6MjA2NzgwODA2M30.KlX9q5uWyiDeMa6D3cl_PRj69N8AJX1Rixz8evlo83w'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase