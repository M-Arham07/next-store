"use client"

import { useState } from "react"
import { Users, ShoppingCart, DollarSign, Package, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Sample data
const statsData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "increase",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Total Users",
    value: "2,350",
    change: "+180.1%",
    changeType: "increase",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Total Orders",
    value: "12,234",
    change: "+19%",
    changeType: "increase",
    icon: ShoppingCart,
    description: "from last month",
  },
  {
    title: "Active Products",
    value: "573",
    change: "+201",
    changeType: "increase",
    icon: Package,
    description: "from last month",
  },
]

const salesData = [
  { month: "Jan", sales: 4000, orders: 240 },
  { month: "Feb", sales: 3000, orders: 139 },
  { month: "Mar", sales: 2000, orders: 980 },
  { month: "Apr", sales: 2780, orders: 390 },
  { month: "May", sales: 1890, orders: 480 },
  { month: "Jun", sales: 2390, orders: 380 },
  { month: "Jul", sales: 3490, orders: 430 },
]

const topProducts = [
  { name: "Wireless Headphones", sales: 1234, revenue: "$24,680", progress: 85 },
  { name: "Smart Watch", sales: 987, revenue: "$19,740", progress: 72 },
  { name: "Laptop Stand", sales: 756, revenue: "$15,120", progress: 58 },
  { name: "USB-C Cable", sales: 543, revenue: "$10,860", progress: 41 },
  { name: "Phone Case", sales: 432, revenue: "$8,640", progress: 33 },
]

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.changeType === "increase" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7 w-full overflow-hidden">
        {/* Sales Chart */}
        <Card className="lg:col-span-4 w-full">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales and orders for the current year</CardDescription>
            {/* Add Legend */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[hsl(220,70%,50%)]"></div>
                <span className="text-sm font-medium">Sales ($)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[hsl(340,75%,55%)]"></div>
                <span className="text-sm font-medium">Orders</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
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
              <div className="w-full h-[250px] sm:h-[350px] min-w-[500px]">
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales ($)",
                      color: "hsl(220, 70%, 50%)",
                    },
                    orders: {
                      label: "Orders",
                      color: "hsl(340, 75%, 55%)",
                    },
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(340, 75%, 55%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(340, 75%, 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-md">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                  </div>
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span className="text-sm font-medium">
                                        {entry.dataKey === "sales" ? `$${entry.value}` : entry.value}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {entry.dataKey === "sales" ? "Sales" : "Orders"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(220, 70%, 50%)"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(220, 70%, 50%)",
                          strokeWidth: 2,
                          stroke: "hsl(var(--background))",
                          r: 5,
                        }}
                        activeDot={{
                          r: 7,
                          stroke: "hsl(220, 70%, 50%)",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                        fill="url(#salesGradient)"
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="hsl(340, 75%, 55%)"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(340, 75%, 55%)",
                          strokeWidth: 2,
                          stroke: "hsl(var(--background))",
                          r: 5,
                        }}
                        activeDot={{
                          r: 7,
                          stroke: "hsl(340, 75%, 55%)",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                        fill="url(#ordersGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales • {product.revenue}
                    </p>
                  </div>
                  <div className="ml-4 font-medium text-sm">{product.progress}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
