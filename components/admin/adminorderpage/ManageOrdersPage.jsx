"use client"

import { useState, useEffect, useContext, useMemo } from "react";

import { Search, Filter, MoreHorizontal, Eye, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DateRangeFilter from "@/components/DateRangeFilter";
import Link from "next/link";
import { OrderManagerContext } from "@/contexts/OrderManagerProvider";
import UpdateStatusDialog from "@/components/admin/adminorderpage/UpdateStatusDialog";
import RejectOrderDialog from "@/components/RejectOrderDialog";
import { useRouter } from "next/navigation";
import CancelReasonDialog from "./CancelReasonDialog";
import AlertNotification from "@/components/AlertNotification";


function getStatusBadge(status) {
  const styles = {
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-500",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-500",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-500",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-500",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-500",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-500"
  }

  return (
    <Badge className={`capitalize border ${styles[status]}`}>
      {status}
    </Badge>
  )
}

export default function ManageOrdersPage({ allOrders = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [formattedDates, setFormattedDates] = useState({});
  const [oldestFirst, setOldestFirst] = useState(false);

  const { currentOrder, setCurrentOrder, setStatusDialogOpen,
    setDeleteDialogOpen, reasonDialogOpen,
    setReasonDialogOpen, showNotification } = useContext(OrderManagerContext);


  const router = useRouter();

  // Memoize filtered and sorted orders
  const filteredOrders = useMemo(() => {
    return allOrders
      .filter((order) => {
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
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return oldestFirst ? dateA - dateB : dateB - dateA;
      });
  }, [allOrders, searchTerm, statusFilter, dateRange, oldestFirst]);

  // Format dates only when orders change
  useEffect(() => {
    const dates = {};
    filteredOrders.forEach(order => {
      dates[order._id] = new Date(order.createdAt).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    });
    setFormattedDates(dates);
  }, [allOrders, searchTerm, statusFilter, dateRange]); // Same dependencies as filteredOrders




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
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOldestFirst(!oldestFirst)}
            className={`flex-1 ${oldestFirst ? 'bg-accent' : ''}`}
          >
            {oldestFirst ? '✓ Oldest First' : 'Oldest First'}
          </Button>
        </div>
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
                  <TableHead className="min-w-[100px]">Amount ($)</TableHead>
                  <TableHead className="min-w-[80px]">Items</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, idx) => (
                  <TableRow key={order._id}
                    className="cursor-pointer h-[70px]"
                    onClick={() => router.push(`/admin/orders/${order.orderId}`)}
                  >

                    <TableCell className="font-medium py-4">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{order.customerDetails.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{order.customerDetails.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-medium py-4">${order.pricing.total.toFixed(2)}</TableCell>
                    <TableCell className="text-sm py-4">{order.orderedItems.length}</TableCell>
                    <TableCell className="text-sm py-4">
                      {formattedDates[order._id] || ''}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu onOpenChange={() => setCurrentOrder(order)}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-muted">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-6 w-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <Link href={`/admin/orders/${order.orderId}`} className="w-full">
                            <DropdownMenuItem className="h-11 py-2 border-b cursor-pointer">
                              <Eye className="mr-3 h-5 w-5" />
                              View Details
                            </DropdownMenuItem>
                          </Link>

                          {order.status === "cancelled" ? (
                            <DropdownMenuItem 
                              onClick={() => setReasonDialogOpen(true)}
                              className="h-11 py-2 cursor-pointer"
                            >
                              <HelpCircle className="mr-3 h-5 w-5" />
                              View Cancel Reason
                            </DropdownMenuItem>
                          ) : order.status !== "delivered" && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => setStatusDialogOpen(true)}
                                className="h-11 py-2 border-b cursor-pointer"
                              >
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="h-11 py-2 text-red-600 cursor-pointer"
                                onClick={() => setDeleteDialogOpen(true)}
                              >
                                Reject Order
                              </DropdownMenuItem>
                            </>
                          )}
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
      {/* These dialog have a shared state, so when state is update from this component
      its trasnmitted to all these dialogs so they're easily opened by the state as its a shared one!
       */}
      <UpdateStatusDialog />
      <RejectOrderDialog canceller="admin" />


      {/* Im not using internal state for this component cuz i also have to use
         it for displaying cancel reason on user side, and using internal state for this gonna be a mess!
       */}

      <CancelReasonDialog
        open={reasonDialogOpen}
        onOpenChange={setReasonDialogOpen}
        cancelDetails={{
          cancelledAt: currentOrder?.cancelledAt,
          reason: currentOrder?.cancelReason,
          cancelledBy: currentOrder?.cancelledBy
        }}
      />

      {showNotification && (
        <AlertNotification
          message={`Order ${currentOrder.status === "cancelled" ? "cancelled" : `status updated to ${currentOrder.status}`} successfully!`}
          linkName=""
          linkHref="#"
        />
      )}

    </div>
  )
}


