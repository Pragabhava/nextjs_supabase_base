"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const OPTIONS = {
    fruits: ['apple', 'banana'],
    vegetables: ['onion', 'garlic']
} as const

type Distribuidora = keyof typeof OPTIONS
type Editorial = (typeof OPTIONS)[Distribuidora][number]

// Helper function to get all items from all categories
const getAllEditoriales = () => {
    return Object.values(OPTIONS).flat() as Editorial[]
}

export function ChainedSelectors() {
    // Initialize with all categories and items selected
    const [selectedDistribuidoras, setSelectedDistribuidoras] = useState<Distribuidora[]>(
        Object.keys(OPTIONS) as Distribuidora[]
    )
    const [selectedEditoriales, setSelectedEditoriales] = useState<Editorial[]>(
        getAllEditoriales()
    )

    const handleDistribuidoraToggle = (distribuidora: Distribuidora) => {
        setSelectedDistribuidoras(prev => {
            const newDistribuidoras = prev.includes(distribuidora)
                ? prev.filter(c => c !== distribuidora)
                : [...prev, distribuidora]

            // Update selected items based on selected categories
            setSelectedEditoriales(prev => {
                const availableEditoriales = newDistribuidoras.flatMap(dist => OPTIONS[dist])
                return prev.filter(editorial => availableEditoriales.includes(editorial))
            })

            return newDistribuidoras
        })
    }

    const handleEditorialToggle = (editorial: Editorial) => {
        setSelectedEditoriales(prev =>
            prev.includes(editorial)
                ? prev.filter(i => i !== editorial)
                : [...prev, editorial]
        )
    }

    // Helper to check if an item is selectable (its category is selected)
    const isEditorialSelectable = (editorial: Editorial) => {
        return Object.entries(OPTIONS).some(([distribuidora, editoriales]) =>
            editoriales.includes(editorial) && selectedDistribuidoras.includes(distribuidora as Distribuidora)
        )
    }

    const getTotalSelections = () => {
        const total = selectedDistribuidoras.length + selectedEditoriales.length
        return total > 0 ? total : 'None'
    }

    return (
        <div
            className={cn(
                "bg-card text-card-foreground rounded-xl border shadow-sm",
            )}
        >
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="selectors">
                    <AccordionTrigger className="hover:no-underline px-4 py-3">
                        <div className="flex items-center gap-4">
                            <span>Selections</span>
                            <div className="flex gap-2">
                                <Badge variant="secondary">
                                    {selectedDistribuidoras.length} distribuidoras
                                </Badge>
                                <Badge variant="secondary">
                                    {selectedEditoriales.length} editoriales
                                </Badge>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Distribuidoras Section */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Distribuidoras</h3>
                                    <Badge variant="outline">
                                        {selectedDistribuidoras.length} distribuidoras
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-2 p-4 border rounded-md">
                                    {(Object.keys(OPTIONS) as Distribuidora[]).map((distribuidora) => (
                                        <label
                                            key={distribuidora}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                                        >
                                            <Checkbox
                                                checked={selectedDistribuidoras.includes(distribuidora)}
                                                onCheckedChange={() => handleDistribuidoraToggle(distribuidora)}
                                            />
                                            <span className="text-sm capitalize">
                                                {distribuidora}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Separator for mobile */}
                            <Separator className="md:hidden my-4" />

                            {/* Editoriales Section */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Editoriales</h3>
                                    <Badge variant="outline">
                                        {selectedEditoriales.length} editoriales
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-4 p-4 border rounded-md">
                                    {Object.entries(OPTIONS).map(([distribuidora, editoriales]) => (
                                        <div key={distribuidora} className="flex flex-col gap-2">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                                {distribuidora}
                                            </div>
                                            {editoriales.map((editorial) => (
                                                <label
                                                    key={editorial}
                                                    className={cn(
                                                        "flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors",
                                                        !isEditorialSelectable(editorial) && "opacity-50"
                                                    )}
                                                >
                                                    <Checkbox
                                                        checked={selectedEditoriales.includes(editorial)}
                                                        onCheckedChange={() => handleEditorialToggle(editorial)}
                                                        disabled={!isEditorialSelectable(editorial)}
                                                    />
                                                    <span className="text-sm capitalize">
                                                        {editorial}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Selection Summary */}
                        <div className="mt-6 text-sm text-muted-foreground bg-muted/20 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <strong>Distribuidoras seleccionadas:</strong>{' '}
                                    {selectedDistribuidoras.length > 0
                                        ? selectedDistribuidoras.join(', ')
                                        : 'Ninguna'}
                                </div>
                                <div>
                                    <strong>Editoriales seleccionadas:</strong>{' '}
                                    {selectedEditoriales.length > 0
                                        ? selectedEditoriales.join(', ')
                                        : 'Ninguna'}
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
