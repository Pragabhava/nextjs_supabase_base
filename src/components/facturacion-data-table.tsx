"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { getFacturacionTable, type Facturacion } from '@/app/actions/facturacion-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Columns,
    LayoutList,
    TableProperties,
    Search
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface FacturacionDataTableProps {
    selectedEditoriales: string[]
    editorialMap: Record<string, string>
    dateRange: { from: Date | undefined; to: Date | undefined }
}

// Helper function to truncate text and add ellipsis
function truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Helper function to format currency with comma separators
function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Helper function to format numbers with comma separators
function formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('es-MX').format(value);
}

// Column definition type
type Column = {
    key: keyof Facturacion;
    header: string;
    sortable: boolean;
    align?: 'left' | 'right';
    format?: (value: any) => string;
    width?: string;
}

export function FacturacionDataTable({
    selectedEditoriales,
    editorialMap,
    dateRange
}: FacturacionDataTableProps) {
    // State for data
    const [data, setData] = useState<Facturacion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isTimeout, setIsTimeout] = useState(false)

    // Pagination state
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)

    // Sorting state
    const [sortColumn, setSortColumn] = useState<keyof Facturacion>('UnidadesFacturadas')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>("")

    // Define columns
    const columns: Column[] = [
        { key: 'ISBN', header: 'ISBN', sortable: true, width: 'w-24' },
        { key: 'Titulo', header: 'Título', sortable: true, width: 'w-56 max-w-xs' },
        { key: 'Autor', header: 'Autor', sortable: true, width: 'w-40' },
        { key: 'Editorial', header: 'Editorial', sortable: true, width: 'w-40' },
        {
            key: 'PVP',
            header: 'PVP',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-24'
        },
        {
            key: 'PvpEfectivo',
            header: 'PVP\nEfectivo',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-24'
        },
        {
            key: 'UnidadesFacturadas',
            header: 'Unidades\nFacturadas',
            sortable: true,
            align: 'right',
            format: (value) => formatNumber(value),
            width: 'w-24'
        },
        {
            key: 'UnidadesDevueltas',
            header: 'Unidades\nDevueltas',
            sortable: true,
            align: 'right',
            format: (value) => formatNumber(value),
            width: 'w-24'
        },
        {
            key: 'UnidadesNetas',
            header: 'Unidades\nNetas',
            sortable: true,
            align: 'right',
            format: (value) => formatNumber(value),
            width: 'w-24'
        },
        {
            key: 'ImporteFacturado',
            header: 'Importe',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-24'
        },
        {
            key: 'ImporteDevuelto',
            header: 'Importe\nDevuelto',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-24'
        },
        {
            key: 'ImporteNeto',
            header: 'Importe\nNeto',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-24'
        }
    ]

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState<Record<keyof Facturacion, boolean>>(
        Object.fromEntries(columns.map(column => [column.key, true])) as Record<keyof Facturacion, boolean>
    );

    // Filter columns based on visibility
    const displayColumns = columns.filter(column => visibleColumns[column.key]);

    // Column visibility dropdown component
    const ColumnVisibilityDropdown = () => {
        // Add temporary state for column visibility that only gets applied when clicking "Apply"
        const [tempVisibleColumns, setTempVisibleColumns] = useState<Record<keyof Facturacion, boolean>>(visibleColumns);
        const [dropdownOpen, setDropdownOpen] = useState(false);

        // Group columns by category
        const columnGroups = {
            "Información Básica": columns.filter(col =>
                ['ISBN', 'Titulo', 'Autor', 'Editorial'].includes(col.key)),
            "Precios": columns.filter(col =>
                ['PVP', 'PvpEfectivo'].includes(col.key)),
            "Unidades": columns.filter(col =>
                ['UnidadesFacturadas', 'UnidadesDevueltas', 'UnidadesNetas'].includes(col.key)),
            "Importes": columns.filter(col =>
                ['ImporteFacturado', 'ImporteDevuelto', 'ImporteNeto'].includes(col.key))
        };

        // Reset temp state when dropdown opens
        useEffect(() => {
            if (dropdownOpen) {
                setTempVisibleColumns({ ...visibleColumns });
            }
        }, [dropdownOpen, visibleColumns]);

        // Count visible columns
        const visibleColumnCount = Object.values(tempVisibleColumns).filter(Boolean).length;

        return (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto flex items-center gap-2"
                        title="Gestionar columnas visibles"
                    >
                        <TableProperties className="h-4 w-4" />
                        <Badge variant="secondary" className="text-xs ml-1">
                            {visibleColumnCount}
                        </Badge>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[500px]">
                    <div className="px-3 py-1.5 flex justify-between items-center">
                        <div className="text-sm font-medium flex items-center gap-2">
                            <TableProperties className="h-4 w-4" />
                            <span>Columnas visibles</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setTempVisibleColumns(Object.fromEntries(columns.map(column => [column.key, true])) as Record<keyof Facturacion, boolean>);
                            }}
                            className="h-6 text-xs px-2"
                        >
                            Resetear
                        </Button>
                    </div>
                    <DropdownMenuSeparator />

                    <div className="max-h-[400px] overflow-y-auto">
                        <div className="p-3">
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between mb-1 pb-2 border-b">
                                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors">
                                        <Checkbox
                                            checked={columns.every(col => tempVisibleColumns[col.key])}
                                            onCheckedChange={(checked) => {
                                                setTempVisibleColumns(prev => {
                                                    const newState = { ...prev };
                                                    columns.forEach(col => {
                                                        newState[col.key] = !!checked;
                                                    });

                                                    // Ensure at least one column remains visible
                                                    if (!Object.values(newState).some(Boolean)) {
                                                        newState[columns[0].key] = true;
                                                    }

                                                    return newState;
                                                });
                                            }}
                                        />
                                        <span className="text-sm font-medium">Seleccionar todas las columnas</span>
                                    </label>
                                    <Badge variant="secondary" className="text-xs">
                                        {visibleColumnCount}/{columns.length}
                                    </Badge>
                                </div>
                                {Object.entries(columnGroups).map(([groupName, groupColumns]) => (
                                    <div key={groupName} className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-xs font-medium">{groupName}</h3>
                                            <Badge variant="outline" className="text-xs px-1.5 py-0">
                                                {groupColumns.filter(col => tempVisibleColumns[col.key]).length} columnas
                                            </Badge>
                                        </div>
                                        <div className="flex flex-col gap-1 p-2 border rounded-md">
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                                                <label
                                                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded-md transition-colors border-b pb-1 mb-1 col-span-2"
                                                >
                                                    <Checkbox
                                                        className="h-3.5 w-3.5"
                                                        checked={groupColumns.every(col => tempVisibleColumns[col.key])}
                                                        onCheckedChange={(checked) => {
                                                            setTempVisibleColumns(prev => {
                                                                const newState = { ...prev };
                                                                groupColumns.forEach(col => {
                                                                    newState[col.key] = !!checked;
                                                                });

                                                                // Ensure at least one column remains visible
                                                                if (!Object.values(newState).some(Boolean)) {
                                                                    newState[columns[0].key] = true;
                                                                }

                                                                return newState;
                                                            });
                                                        }}
                                                    />
                                                    <span className="text-xs font-medium">
                                                        Seleccionar todas
                                                    </span>
                                                </label>
                                                {groupColumns.map((column) => (
                                                    <label
                                                        key={column.key as string}
                                                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded-md transition-colors"
                                                    >
                                                        <Checkbox
                                                            className="h-3.5 w-3.5"
                                                            id={`column-${column.key}`}
                                                            checked={tempVisibleColumns[column.key]}
                                                            disabled={tempVisibleColumns[column.key] && Object.values(tempVisibleColumns).filter(Boolean).length === 1}
                                                            onCheckedChange={(checked) => {
                                                                // Prevent unchecking the last visible column
                                                                if (checked === false && Object.values(tempVisibleColumns).filter(Boolean).length === 1 && tempVisibleColumns[column.key]) {
                                                                    return;
                                                                }

                                                                setTempVisibleColumns((prev) => ({
                                                                    ...prev,
                                                                    [column.key]: !!checked
                                                                }));
                                                            }}
                                                        />
                                                        <span className="text-xs truncate">
                                                            {column.header.replace('\n', ' ')}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-2 border-t flex justify-end gap-2 sticky bottom-0 bg-background">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDropdownOpen(false)}
                            className="h-7 text-xs px-2"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                                setVisibleColumns(tempVisibleColumns);
                                setDropdownOpen(false);
                            }}
                            className="h-7 text-xs px-2"
                        >
                            Aplicar
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    // Fetch data when filters change
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        setIsTimeout(false)

        try {
            // Set up timeout detection
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('La solicitud ha excedido el tiempo de espera')), 30000)
            })

            // Format dates for the API
            const fechaInicio = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
            const fechaFin = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

            // Get all selected editorial names from the map using composite keys
            const editorialesArray = selectedEditoriales.length > 0
                ? selectedEditoriales.map(compositeKey => editorialMap[compositeKey]).filter(Boolean)
                : [];

            // Race between actual fetch and timeout
            const result = await Promise.race([
                getFacturacionTable(fechaInicio, fechaFin, editorialesArray),
                timeoutPromise
            ])

            if (result.error) {
                throw new Error(result.error)
            }

            setData(result.data)
            // Reset to first page when data changes
            setPage(1)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos'
            setError(errorMessage)
            // Check if it's a timeout error
            if (err instanceof Error && err.message === 'La solicitud ha excedido el tiempo de espera') {
                setIsTimeout(true)
            }
            console.error('Error loading data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedEditoriales, editorialMap, dateRange])

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle undefined or null values
        if (aValue === undefined || aValue === null) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (bValue === undefined || bValue === null) {
            return sortDirection === 'asc' ? 1 : -1;
        }

        // For string values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        // For numeric values
        return sortDirection === 'asc'
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
    });

    // Handle sort toggle
    const handleSort = (column: keyof Facturacion) => {
        if (sortColumn === column) {
            // Toggle direction if clicking the same column
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new column and default to desc (most common for data tables)
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    // Get sort icon
    const getSortIcon = (column: keyof Facturacion) => {
        if (sortColumn !== column) {
            return <ArrowUpDown className="inline ml-1 h-4 w-4 text-muted-foreground" />;
        }
        return sortDirection === 'asc'
            ? <ArrowUp className="inline ml-1 h-4 w-4" />
            : <ArrowDown className="inline ml-1 h-4 w-4" />;
    };

    // Apply search filter to sorted data
    const filteredData = searchTerm.trim() === ""
        ? sortedData
        : sortedData.filter(item => {
            const searchLower = searchTerm.toLowerCase();

            // Search through all visible columns that are strings or can be converted to strings
            return Object.entries(item).some(([key, value]) => {
                // Only search in visible columns
                if (!visibleColumns[key as keyof Facturacion]) {
                    return false;
                }

                // Handle different value types
                if (value === null || value === undefined) {
                    return false;
                }

                // Convert value to string based on column format if available
                const column = columns.find(col => col.key === key);
                const stringValue = column?.format
                    ? column.format(value).toLowerCase()
                    : String(value).toLowerCase();

                return stringValue.includes(searchLower);
            });
        });

    // Pagination (update to use filtered data instead of sorted data)
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm("");
        // Reset to first page when clearing search
        setPage(1);
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8">Cargando datos...</div>
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <div className="text-red-500 text-center">Error: {error}</div>
                {isTimeout && (
                    <Button
                        variant="outline"
                        onClick={fetchData}
                        className="flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                        Intentar nuevamente
                    </Button>
                )}
            </div>
        )
    }

    // Handle the case when there's no data
    if (data.length === 0) {
        return <div className="text-center p-8">No hay datos para mostrar con los filtros seleccionados.</div>
    }

    return (
        <Card className="overflow-hidden rounded-xl border shadow-sm gap-0 py-0">
            <div className="p-2 flex justify-between items-center border-b">
                <span className="text-sm font-medium">Resultados: {filteredData.length}</span>
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow max-w-md">
                        <Input
                            placeholder="Buscar en todos los campos..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1); // Reset to first page when searching
                            }}
                            className="h-8 pr-8 w-full"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            {searchTerm ? (
                                <button
                                    onClick={handleClearSearch}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span className="sr-only">Limpiar búsqueda</span>
                                    ×
                                </button>
                            ) : (
                                <Search className="h-4 w-4 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                    <ColumnVisibilityDropdown />
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow>
                            {displayColumns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={`${column.align === 'right' ? 'text-right' : 'text-center'} ${column.width || ''} p-2`}
                                >
                                    <button
                                        onClick={() => column.sortable && handleSort(column.key)}
                                        className={`${column.sortable ? 'cursor-pointer hover:text-foreground' : ''} font-medium text-muted-foreground w-full ${column.align === 'right' ? 'text-right' : 'text-center'} text-xs md:text-sm whitespace-pre-line leading-tight pt-0`}
                                        disabled={!column.sortable}
                                        title={column.header.replace('\n', ' ')}
                                    >
                                        {column.header}
                                        {column.sortable && getSortIcon(column.key)}
                                    </button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, i) => (
                            <TableRow key={i}>
                                {displayColumns.map((column) => (
                                    <TableCell
                                        key={`${i}-${column.key}`}
                                        className={`${column.align === 'right' ? 'text-right' : ''} ${column.key === 'Titulo' ? 'break-words' : ''} p-2 text-xs md:text-sm`}
                                    >
                                        {column.key === 'Titulo' ? (
                                            <span title={item[column.key]?.toString() || ''}>
                                                {truncateText(item[column.key]?.toString(), 35)}
                                            </span>
                                        ) : column.format ? (
                                            column.format(item[column.key])
                                        ) : (
                                            truncateText(item[column.key]?.toString() || '-', 20)
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-2 border-t">
                <div className="flex items-center text-xs mb-2 sm:mb-0">
                    <span className="text-muted-foreground">
                        Mostrando {paginatedData.length > 0 ? (page - 1) * pageSize + 1 : 0} a {Math.min(page * pageSize, filteredData.length)} de {filteredData.length} resultados
                        {searchTerm && ` (filtrado de ${sortedData.length} resultados totales)`}
                    </span>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="flex items-center mr-2 sm:mr-4">
                        <span className="text-xs mr-1 sm:mr-2">Filas:</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setPage(1); // Reset to first page
                            }}
                        >
                            <SelectTrigger className="h-7 w-14 text-xs">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </Button>

                    <span className="text-xs">
                        {page}/{totalPages || 1}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </Card>
    )
} 