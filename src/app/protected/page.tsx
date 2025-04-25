import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'
import { DataTable } from '@/components/data-table'
import { ChainedSelectors } from '@/components/chained-selectors'
import { DateRangePicker } from '@/components/date-range-picker'

import dataTable from "./data.json"

export default function ProtectedPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-6">
            <ChainedSelectors />
          </div>
          <div className="md:col-span-3 md:self-start">
            <DateRangePicker className="w-full h-[48px]" />
          </div>
        </div>
      </div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={dataTable} />
    </div>
  )
}
