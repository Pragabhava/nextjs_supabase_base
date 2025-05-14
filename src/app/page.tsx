import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from "next/image";

export default async function Home() {
  // Create Supabase server client
  const supabase = await createClient()

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getUser()

  // Redirect based on authentication status
  if (error || !data?.user) {
    // User is not authenticated, redirect to login
    redirect('/auth/login')
  } else {
    // User is authenticated, redirect to protected area
    redirect('/protected')
  }

  // This part won't execute due to redirects, but Next.js expects a return
  return null
}
