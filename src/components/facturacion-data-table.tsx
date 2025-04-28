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
    ArrowDown
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

    // Pagination state
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)

    // Sorting state
    const [sortColumn, setSortColumn] = useState<keyof Facturacion>('Unidades')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Define columns
    const columns: Column[] = [
        { key: 'ISBN', header: 'ISBN', sortable: true, width: 'w-28' },
        { key: 'Titulo', header: 'Título', sortable: true, width: 'w-72 max-w-md' },
        { key: 'Autor', header: 'Autor', sortable: true, width: 'w-48' },
        { key: 'Editorial', header: 'Editorial', sortable: true, width: 'w-48' },
        {
            key: 'PvpEfectivo',
            header: 'PVP Efectivo',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-32'
        },
        {
            key: 'Unidades',
            header: 'Unidades',
            sortable: true,
            align: 'right',
            format: (value) => formatNumber(value),
            width: 'w-28'
        },
        {
            key: 'Importe',
            header: 'Importe',
            sortable: true,
            align: 'right',
            format: (value) => formatCurrency(value),
            width: 'w-32'
        }
    ]

    // Fetch data when filters change
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Format dates for the API
                const fechaInicio = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
                const fechaFin = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

                // Use editorial name from map if available
                const editorial = selectedEditoriales.length > 0 && editorialMap[selectedEditoriales[0]]
                    ? editorialMap[selectedEditoriales[0]]
                    : undefined

                const result = await getFacturacionTable(fechaInicio, fechaFin, editorial)

                if (result.error) {
                    throw new Error(result.error)
                }

                setData(result.data)
                // Reset to first page when data changes
                setPage(1)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar datos')
                console.error('Error loading data:', err)
            } finally {
                setLoading(false)
            }
        }

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

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8">Cargando datos...</div>
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>
    }

    // Handle the case when there's no data
    if (data.length === 0) {
        return <div className="text-center p-8">No hay datos para mostrar con los filtros seleccionados.</div>
    }

    return (
        <Card className="overflow-hidden rounded-xl border shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={`${column.align === 'right' ? 'text-right' : ''} ${column.width || ''}`}
                                >
                                    <button
                                        onClick={() => column.sortable && handleSort(column.key)}
                                        className={`${column.sortable ? 'cursor-pointer hover:text-foreground' : ''} font-medium text-muted-foreground w-full text-${column.align || 'left'}`}
                                        disabled={!column.sortable}
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
                                {columns.map((column) => (
                                    <TableCell
                                        key={`${i}-${column.key}`}
                                        className={`${column.align === 'right' ? 'text-right' : ''} ${column.key === 'Titulo' ? 'break-words' : ''}`}
                                    >
                                        {column.key === 'Titulo' ? (
                                            <span title={item[column.key]?.toString() || ''}>
                                                {truncateText(item[column.key]?.toString(), 60)}
                                            </span>
                                        ) : column.format ? (
                                            column.format(item[column.key])
                                        ) : (
                                            item[column.key] || '-'
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                        Mostrando {paginatedData.length > 0 ? (page - 1) * pageSize + 1 : 0} a {Math.min(page * pageSize, sortedData.length)} de {sortedData.length} resultados
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center mr-4">
                        <span className="text-sm mr-2">Filas por página:</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setPage(1); // Reset to first page
                            }}
                        >
                            <SelectTrigger className="h-8 w-16">
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
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm">
                        Página {page} de {totalPages || 1}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
} 