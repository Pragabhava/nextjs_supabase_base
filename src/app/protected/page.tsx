import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { Navigation } from '@/components/navigation'
import { AppSidebar } from '@/components/sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col h-svh w-full">
      <Navigation user={data.user} />
      <div className="flex flex-1">
        <AppSidebar />
        <main>
        </main>
      </div>
    </div>
  )
}
