"use client"
import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function DateRangeFilter({ dateRange, setDateRange }) {
  return (
    <div className="flex gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-[280px] justify-start text-left font-normal truncate relative pr-8"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd")} -{" "}
                  {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
            {(dateRange.from || dateRange.to) && (
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setDateRange({ from: null, to: null });
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 overflow-x-auto" style={{ maxWidth: 350 }}>
            <Tabs defaultValue="start" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="start">Start Date</TabsTrigger>
                <TabsTrigger value="end">End Date</TabsTrigger>
              </TabsList>
              <TabsContent value="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) =>
                    setDateRange((prev) => ({ ...prev, from: date }))
                  }
                  initialFocus
                  numberOfMonths={1}
                  className="rounded-md border"
                  disabled={(date) => dateRange.to && date > dateRange.to}
                />
              </TabsContent>
              <TabsContent value="end">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) =>
                    setDateRange((prev) => ({ ...prev, to: date }))
                  }
                  initialFocus
                  numberOfMonths={1}
                  className="rounded-md border"
                  disabled={(date) => dateRange.from && date < dateRange.from}
                />
              </TabsContent>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}