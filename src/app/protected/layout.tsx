import { redirect } from 'next/navigation'

import { Navigation } from '@/components/navigation'
import { AppSidebar } from '@/components/sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation user={data.user} />
            <div className="flex flex-1 overflow-hidden">
                <AppSidebar />
                <main className="flex-1 overflow-auto w-0 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
} 