import { createClient } from '@supabase/supabase-js'

// Use environment variables or fallback to provided values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://loucgwyglxohnafbphia.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || ''

// Only create client if we have both URL and key to prevent build errors
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error)
    supabase = null
  }
}

export { supabase }

