import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../supabase-types'

// used to create a supabase client in client side components (from the documentation)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}