"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { format } from "date-fns";
import Link from "next/link";
import DateRangeFilter from "@/components/DateRangeFilter";


export default function YourOrdersPage({ orders = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderId.includes(searchTerm) || order.orderedItems.some((item) =>
      item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "All"
        ? true
        : order.status.toLowerCase() === statusFilter.toLowerCase();
    const orderDate = new Date(order.createdAt);

    // Fix: include all orders on the end date by setting end date to end of day
    let fromDate = dateRange.from ? new Date(dateRange.from) : null;
    let toDate = dateRange.to
      ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 23, 59, 59, 999)
      : null;

    const matchesDateRange =
      (!fromDate || orderDate >= fromDate) &&
      (!toDate || orderDate <= toDate);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Supported statuses for filter
  const supportedStatuses = [
    "Processing",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  return (
    <div className="w-full min-h-screen bg-background py-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {/* Search + Filters */}
        <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
            <Input
              placeholder="Search your orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {supportedStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="relative p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition"
            >
                  <Link href={`/orders/track/${order.orderId}`}>
              {/* Status Pill - Top Right */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full ${
                  order.status.toLowerCase() === "delivered"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                    : order.status.toLowerCase() === "processing"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                    : order.status.toLowerCase() === "confirmed"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : order.status.toLowerCase() === "shipped"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                    : order.status.toLowerCase() === "out for delivery"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={order.orderedItems[0].images[0]}
                    alt={order.orderedItems[0].title}
                    width={120}
                    height={120}
                    className="rounded-md object-cover w-full h-[200px] sm:w-[150px] sm:h-[150px]"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <p className="font-medium text-lg truncate">
                    {order.orderedItems[0].title}
                    {order.orderedItems.length > 1 && (
                      <span className="text-muted-foreground">
                        {" "}+ {order.orderedItems.length - 1} more
                      </span>
                    )}
                  </p>

                  {/* Total Price */}
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Total: ${order.pricing.total.toFixed(2)}
                    </p>
                      <Button variant="ghost" className="text-sm">
                        View <span className="ml-1">→</span>
                      </Button>
                   
                  </div>

                  {/* Order ID + Date */}
                  <div className="text-sm text-muted-foreground mt-4 truncate">
                    Order ID: {order.orderId} | Date:{" "}
                    {order.status.toLowerCase() === "delivered" && order?.deliveredAt
                      ? format(new Date(order.deliveredAt), "yyyy-MM-dd")
                      : format(new Date(order.createdAt), "yyyy-MM-dd")}
                  </div>
                </div>
              </div>
               </Link>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No orders found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
