import { redirect } from 'next/navigation'

import { Navigation } from '@/components/navigation'
import { AppSidebar } from '@/components/sidebar'
import { createClient } from '@/lib/supabase/server'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'
import { DataTable } from '@/components/data-table'

import dataTable from "./data.json"

export default async function ProtectedPage() {
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
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={dataTable} />
          </div>
        </main>
      </div>
    </div>
  )
}
