import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqnyddhqrrujuexfskep.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbnlkZGhxcnJ1anVleGZza2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTY5MjEsImV4cCI6MjA4MTA3MjkyMX0.wG-pB_kxuUrVG1Mfb8G9JVPOhuR4t7zeE-kDddpcM38'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)