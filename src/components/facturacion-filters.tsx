"use client"

import { useState } from "react"
import { DateRangePicker } from "@/components/date-range-picker"
import { FacturacionChainedSelectors } from "@/components/facturacion-chained-selectors"
import { FacturacionDataTable } from "@/components/facturacion-data-table"

export function FacturacionFilters() {
    const [selectedEditoriales, setSelectedEditoriales] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
        to: new Date() // Today
    })

    // Forward selected editorials from ChainedSelectors
    const handleEditorialesChange = (editorials: string[]) => {
        setSelectedEditoriales(editorials)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-6">
                    <FacturacionChainedSelectors
                        onEditorialesChange={handleEditorialesChange}
                    />
                </div>
                <div className="md:col-span-3 md:self-start">
                    <DateRangePicker
                        className="w-full h-[48px]"
                        onChange={setDateRange}
                    />
                </div>
            </div>
            <div className="mt-4">
                <FacturacionDataTable
                    selectedEditoriales={selectedEditoriales}
                    dateRange={dateRange}
                />
            </div>
        </>
    )
} 