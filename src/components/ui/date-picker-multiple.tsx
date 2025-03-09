"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerMultipleProps {
  dates: Date[]
  onChange: (dates: Date[]) => void
  className?: string
  placeholder?: string
}

export function DatePickerMultiple({
  dates,
  onChange,
  className,
  placeholder = "Add event dates",
}: DatePickerMultipleProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)

  const handleAddDate = () => {
    if (selectedDate) {
      // Check if date already exists to avoid duplicates
      const dateExists = dates.some(date => 
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate()
      )

      if (!dateExists) {
        onChange([...dates, selectedDate])
      }
      
      setSelectedDate(undefined)
      setOpen(false)
    }
  }

  const handleRemoveDate = (dateToRemove: Date) => {
    onChange(dates.filter(date => 
      !(date.getFullYear() === dateToRemove.getFullYear() &&
        date.getMonth() === dateToRemove.getMonth() &&
        date.getDate() === dateToRemove.getDate())
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {dates.map((date, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {format(date, "PPP")}
            <button
              type="button"
              className="ml-2 rounded-full outline-none"
              onClick={() => handleRemoveDate(date)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                className
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          type="button"
          variant="secondary"
          onClick={handleAddDate}
          disabled={!selectedDate}
        >
          Add Date
        </Button>
      </div>
    </div>
  )
}
