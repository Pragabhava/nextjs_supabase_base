"use client"

import { useState, useEffect } from "react"
import { DateRangePicker } from "@/components/date-range-picker"
import { FacturacionChainedSelectors } from "@/components/facturacion-chained-selectors"
import { FacturacionDataTable } from "@/components/facturacion-data-table"
import { getEditoriales, type Editorial } from "@/app/actions/chained-selectors"

// Helper function to create composite key - must match the one in chained-selectors
function createCompositeKey(distribuidoraId: number | string, editorialId: number | string): string {
    return `${distribuidoraId}:${editorialId}`;
}

export function FacturacionFilters() {
    const [selectedEditoriales, setSelectedEditoriales] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
        to: new Date() // Today
    })
    const [editorialMap, setEditorialMap] = useState<Record<string, string>>({})

    // Fetch editorial mapping on mount
    useEffect(() => {
        async function fetchEditoriales() {
            const result = await getEditoriales()
            if (!result.error) {
                const map: Record<string, string> = {}
                result.data.forEach((e: Editorial) => {
                    // Create composite key including distribuidora ID
                    const compositeKey = createCompositeKey(e.IdDistribuidora, e.IdEditorial);
                    map[compositeKey] = e.Editorial
                })
                setEditorialMap(map)
            }
        }
        fetchEditoriales()
    }, [])

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
                    editorialMap={editorialMap}
                    dateRange={dateRange}
                />
            </div>
        </>
    )
} 