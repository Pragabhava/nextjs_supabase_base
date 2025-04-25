import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'
import { DataTable } from '@/components/data-table'
import { ChainedSelectors } from '@/components/chained-selectors'

import dataTable from "./data.json"

export default function ProtectedPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <ChainedSelectors />
      </div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={dataTable} />
    </div>
  )
}
