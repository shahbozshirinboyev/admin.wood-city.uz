import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kabseqlaocgfypqvkzxz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYnNlcWxhb2NnZnlwcXZrenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyOTc3NDMsImV4cCI6MjA0Nzg3Mzc0M30.QnEssKROsUBaMLMUa73HWTfzCI4-vdi7YHXbY1htj_U'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;