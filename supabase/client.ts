import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY as string

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}