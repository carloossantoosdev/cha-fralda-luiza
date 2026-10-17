import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabase: SupabaseClient | null =
  isHttpUrl(url) && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = supabase !== null
