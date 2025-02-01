"use client"

import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useState } from "react"

export function DateRangePicker({
                                    date,
                                    setDate,
                                }: {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}) {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(date)

    return (
        <div className={cn("grid gap-2")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn("w-[260px] justify-start text-left font-normal text-black", !selectedDate && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate?.from ? (
                            selectedDate.to ? (
                                <>
                                    {format(selectedDate.from, "LLL dd, y")} - {format(selectedDate.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(selectedDate.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="range"
                        defaultMonth={selectedDate?.from || new Date()}
                        selected={selectedDate}
                        onSelect={(range) => {
                            setSelectedDate(range)
                            setDate(range)
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}