"use client"

import { useState, useEffect } from "react"
import { Eye, MoreHorizontal, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import DateRangeFilter from "@/components/DateRangeFilter"


function getStatusBadge(status) {
    const variants = {
        delivered: "default",
        pending: "secondary",
        processing: "outline",
        cancelled: "destructive",
    }

    return (
        <Badge variant={variants[status]} className="capitalize">
            {status}
        </Badge>
    )
}

export default function ManageOrdersPage({ allOrders = [] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [formattedDates, setFormattedDates] = useState([])
    const [dateRange, setDateRange] = useState({ from: null, to: null })

    useEffect(() => {
        // Format dates only on client side
        setFormattedDates(
            allOrders.map(order =>
                order.createdAt
                    ? new Date(order.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    })
                    : ""
            )
        )
    }, [allOrders])

    // Date filter logic: include all orders on the end date
    const filteredOrders = allOrders.filter((order) => {
        const matchesSearch =
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerDetails.phone.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        const orderDate = new Date(order.createdAt)
        let fromDate = dateRange.from ? new Date(dateRange.from) : null
        let toDate = dateRange.to
            ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 23, 59, 59, 999)
            : null
        const matchesDateRange =
            (!fromDate || orderDate >= fromDate) &&
            (!toDate || orderDate <= toDate)

        return matchesSearch && matchesStatus && matchesDateRange
    })

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage and track all customer orders</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full md:w-auto">
                            <Filter className="mr-2 h-4 w-4" />
                            Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Orders</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("delivered")}>Delivered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("processing")}>Processing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="w-full md:w-auto">
                    <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
                </div>
            </div>

            {/* Orders Table */}
            <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>Complete list of customer orders with status and details</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--border)) transparent",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                height: 8px;
              }
              div::-webkit-scrollbar-track {
                background: hsl(var(--muted));
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb {
                background: hsl(var(--border));
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: hsl(var(--muted-foreground));
              }
            `}</style>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Order ID</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[80px]">Items</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, idx) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{order.customerDetails.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{order.customerDetails.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-medium">{order.pricing.total.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{order.orderedItems.length}</TableCell>
                    <TableCell className="text-sm">
                      {formattedDates[idx]}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem >Update Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
        </div>
    )
}

