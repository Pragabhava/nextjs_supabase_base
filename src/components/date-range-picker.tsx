"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DateRangePickerProps {
    className?: string
    onChange?: (dateRange: { from: Date | undefined; to: Date | undefined }) => void
}

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [startDate, setStartDate] = React.useState<Date | undefined>(
        new Date(new Date().getFullYear(), 0, 1) // January 1st of current year
    )
    const [endDate, setEndDate] = React.useState<Date | undefined>(
        new Date() // Today
    )

    // For display purposes in the button
    const dateRange = React.useMemo(() => ({
        from: startDate,
        to: endDate
    }), [startDate, endDate])

    // Set default month view for each calendar
    const [startDateMonth, setStartDateMonth] = React.useState<Date | undefined>(startDate)
    const [endDateMonth, setEndDateMonth] = React.useState<Date | undefined>(endDate)

    // Update month views when dates change
    React.useEffect(() => {
        if (startDate) {
            setStartDateMonth(startDate)
        }
    }, [startDate])

    React.useEffect(() => {
        if (endDate) {
            setEndDateMonth(endDate)
        }
    }, [endDate])

    const handleApply = () => {
        if (onChange) {
            onChange(dateRange)
        }
        setIsOpen(false)
    }

    return (
        <div className={cn("flex items-center space-x-2 col-span-3", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal w-full",
                            !dateRange.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "PPP", { locale: es })} - {format(dateRange.to, "PPP", { locale: es })}
                                </>
                            ) : (
                                format(dateRange.from, "PPP", { locale: es })
                            )
                        ) : (
                            <span>Seleccionar rango de fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex flex-col">
                        <div className="flex p-2 space-x-4">
                            <div>
                                <p className="mb-2 text-sm font-medium">Fecha inicial</p>
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                    month={startDateMonth}
                                    onMonthChange={setStartDateMonth}
                                    numberOfMonths={1}
                                    locale={es}
                                    disabled={(date) => endDate ? date > endDate : false}
                                />
                            </div>
                            <Separator orientation="vertical" className="h-auto" />
                            <div>
                                <p className="mb-2 text-sm font-medium">Fecha final</p>
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    month={endDateMonth}
                                    onMonthChange={setEndDateMonth}
                                    numberOfMonths={1}
                                    locale={es}
                                    disabled={(date) => startDate ? date < startDate : false}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            <Button onClick={handleApply}>Aplicar</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
