"use client"

import { useState, useEffect, useRef } from "react"
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
import { Button } from "@/components/ui/button"
import { getDistribuidoras, getEditoriales } from "@/app/actions/chained-selectors"

// These types will match our server types
type Distribuidora = {
    IdDistribuidora: number;
    CodigoDistribuidora: string;
    Distribuidora: string;
}

type Editorial = {
    IdEditorial: number;
    CodigoEditorial: string;
    Editorial: string;
    IdDistribuidora: number;
    CodigoDistribuidora: string;
    Distribuidora: string;
}

// This will be built dynamically from the fetched data
interface DistribuidoraOption {
    name: string;
    values: string[]; // Store editorial IDs as strings
}

interface FacturacionChainedSelectorsProps {
    onEditorialesChange?: (editorials: string[]) => void
}

export function FacturacionChainedSelectors({ onEditorialesChange }: FacturacionChainedSelectorsProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<Record<string, DistribuidoraOption>>({});
    const [distribuidoras, setDistribuidoras] = useState<Distribuidora[]>([]);
    const [editoriales, setEditoriales] = useState<Editorial[]>([]);
    const accordionTriggerRef = useRef<HTMLButtonElement>(null);

    // Final selections (after apply is clicked)
    const [selectedDistribuidoras, setSelectedDistribuidoras] = useState<string[]>([]);
    const [selectedEditoriales, setSelectedEditoriales] = useState<string[]>([]);

    // Pending selections (before apply is clicked)
    const [pendingDistribuidoras, setPendingDistribuidoras] = useState<string[]>([]);
    const [pendingEditoriales, setPendingEditoriales] = useState<string[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Notify parent component when selectedEditoriales changes (after apply button is clicked)
    useEffect(() => {
        if (onEditorialesChange) {
            onEditorialesChange(selectedEditoriales);
        }
    }, [selectedEditoriales, onEditorialesChange]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch distribuidoras and editoriales
                const [distribuidorasResult, editorialesResult] = await Promise.all([
                    getDistribuidoras(),
                    getEditoriales()
                ]);

                if (distribuidorasResult.error) {
                    throw new Error(distribuidorasResult.error);
                }

                if (editorialesResult.error) {
                    throw new Error(editorialesResult.error);
                }

                // Store the raw data
                setDistribuidoras(distribuidorasResult.data);
                setEditoriales(editorialesResult.data);

                // Build the options structure
                const optionsMap: Record<string, DistribuidoraOption> = {};

                distribuidorasResult.data.forEach(distribuidora => {
                    // Find all editoriales for this distribuidora
                    const distribuidoraEditoriales = editorialesResult.data
                        .filter(editorial => editorial.IdDistribuidora === distribuidora.IdDistribuidora)
                        .map(editorial => editorial.IdEditorial.toString());

                    optionsMap[distribuidora.IdDistribuidora.toString()] = {
                        name: distribuidora.Distribuidora,
                        values: distribuidoraEditoriales
                    };
                });

                setOptions(optionsMap);

                // Set initial selections to all distribuidoras and editoriales
                const allDistribuidoras = distribuidorasResult.data.map(d => d.IdDistribuidora.toString());
                const allEditoriales = editorialesResult.data.map(e => e.IdEditorial.toString());

                setSelectedDistribuidoras(allDistribuidoras);
                setSelectedEditoriales(allEditoriales);
                setPendingDistribuidoras(allDistribuidoras);
                setPendingEditoriales(allEditoriales);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Apply changes from pending to selected state
    const handleApply = () => {
        setSelectedDistribuidoras(pendingDistribuidoras);
        setSelectedEditoriales(pendingEditoriales);
        setHasChanges(false);

        // Collapse the accordion by clicking the trigger
        if (accordionTriggerRef.current) {
            accordionTriggerRef.current.click();
        }
    };

    // Helper function to get all items from all categories
    const getAllEditoriales = () => {
        return Object.values(options).flatMap(distribuidora => distribuidora.values);
    }

    // Modified functions for Select All functionality to update pending state
    const handleSelectAllDistribuidoras = (selectAll: boolean) => {
        const allDistribuidoraIds = Object.keys(options);
        if (selectAll) {
            setPendingDistribuidoras(allDistribuidoraIds);
            // When selecting all distribuidoras, also select all editoriales
            setPendingEditoriales(getAllEditoriales());
        } else {
            setPendingDistribuidoras([]);
            setPendingEditoriales([]);
        }
        setHasChanges(true);
    }

    const handleSelectAllEditoriales = (selectAll: boolean) => {
        const availableEditoriales = pendingDistribuidoras.flatMap(dist =>
            options[dist]?.values || []
        );

        if (selectAll) {
            setPendingEditoriales(availableEditoriales);
        } else {
            setPendingEditoriales([]);
        }
        setHasChanges(true);
    }

    const handleDistribuidoraToggle = (distribuidora: string) => {
        setPendingDistribuidoras(prev => {
            const newDistribuidoras = prev.includes(distribuidora)
                ? prev.filter(d => d !== distribuidora)
                : [...prev, distribuidora];

            // Update selected items based on selected categories
            setPendingEditoriales(prev => {
                const availableEditoriales = newDistribuidoras.flatMap(dist => options[dist]?.values || []);
                return prev.filter(editorial => availableEditoriales.includes(editorial));
            });

            return newDistribuidoras;
        });
        setHasChanges(true);
    }

    const handleEditorialToggle = (editorial: string) => {
        setPendingEditoriales(prev =>
            prev.includes(editorial)
                ? prev.filter(e => e !== editorial)
                : [...prev, editorial]
        );
        setHasChanges(true);
    }

    // Helper to check if an item is selectable (its category is selected)
    const isEditorialSelectable = (editorial: string) => {
        return Object.entries(options).some(([distribuidoraId, option]) =>
            option.values.includes(editorial) && pendingDistribuidoras.includes(distribuidoraId)
        );
    }

    // Function to get editorial name by id
    const getEditorialName = (id: string) => {
        const editorial = editoriales.find(e => e.IdEditorial.toString() === id);
        return editorial?.Editorial || id;
    }

    if (loading) {
        return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div
            className={cn(
                "bg-card text-card-foreground rounded-xl border shadow-sm",
            )}
        >
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="selectors">
                    <AccordionTrigger className="hover:no-underline px-4 py-3" ref={accordionTriggerRef}>
                        <div className="flex items-center gap-4">
                            <span>Filtros</span>
                            <div className="flex gap-2">
                                <Badge variant="secondary">
                                    {selectedDistribuidoras.length} distribuidoras
                                </Badge>
                                <Badge variant="secondary">
                                    {selectedEditoriales.length} editoriales
                                </Badge>
                                {hasChanges && (
                                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                        Cambios pendientes
                                    </Badge>
                                )}
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
                                        {pendingDistribuidoras.length} distribuidoras
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-2 p-4 border rounded-md">
                                    <label
                                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors border-b pb-2 mb-1"
                                    >
                                        <Checkbox
                                            checked={pendingDistribuidoras.length === Object.keys(options).length}
                                            onCheckedChange={(checked) => handleSelectAllDistribuidoras(!!checked)}
                                        />
                                        <span className="text-sm font-medium">
                                            Seleccionar todas
                                        </span>
                                    </label>
                                    {Object.keys(options).map((distribuidoraId) => (
                                        <label
                                            key={distribuidoraId}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                                        >
                                            <Checkbox
                                                checked={pendingDistribuidoras.includes(distribuidoraId)}
                                                onCheckedChange={() => handleDistribuidoraToggle(distribuidoraId)}
                                            />
                                            <span className="text-sm capitalize">
                                                {options[distribuidoraId].name}
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
                                        {pendingEditoriales.length} editoriales
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-4 p-4 border rounded-md h-[300px] overflow-y-auto">
                                    <label
                                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors border-b pb-2 mb-1"
                                    >
                                        <Checkbox
                                            checked={pendingEditoriales.length === pendingDistribuidoras.flatMap(dist => options[dist]?.values || []).length}
                                            onCheckedChange={(checked) => handleSelectAllEditoriales(!!checked)}
                                        />
                                        <span className="text-sm font-medium">
                                            Seleccionar todas
                                        </span>
                                    </label>
                                    {Object.entries(options).map(([distribuidoraId, option]) => (
                                        <div key={distribuidoraId} className="flex flex-col gap-2">
                                            <div className="text-xs text-muted-foreground tracking-wider">
                                                {option.name}
                                            </div>
                                            {option.values.map((editorialId) => (
                                                <label
                                                    key={editorialId}
                                                    className={cn(
                                                        "flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors",
                                                        !isEditorialSelectable(editorialId) && "opacity-50"
                                                    )}
                                                >
                                                    <Checkbox
                                                        checked={pendingEditoriales.includes(editorialId)}
                                                        onCheckedChange={() => handleEditorialToggle(editorialId)}
                                                        disabled={!isEditorialSelectable(editorialId)}
                                                    />
                                                    <span className="text-sm capitalize">
                                                        {getEditorialName(editorialId)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex justify-end mt-6 pt-2 border-t">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleApply}
                                disabled={!hasChanges}
                            >
                                Aplicar cambios
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
} 