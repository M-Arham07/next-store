"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  LayoutDashboard,
  FolderOpen,
  Users,
  BarChart3,
  Cog,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

const navigationItems = [
  { name: "Dashboard", href: "#", icon: LayoutDashboard, description: "Overview and metrics" },
  { name: "Projects", href: "#", icon: FolderOpen, description: "Manage your projects" },
  { name: "Team", href: "#", icon: Users, description: "Team collaboration" },
  { name: "Analytics", href: "#", icon: BarChart3, description: "Data insights" },
  { name: "Settings", href: "#", icon: Cog, description: "Account preferences" },
]

const profileMenuItems = [
  { name: "Profile", icon: User, href: "#" },
  { name: "Settings", icon: Settings, href: "#" },
  { name: "Notifications", icon: Bell, href: "#" },
  { name: "Help Center", icon: HelpCircle, href: "#" },
  { name: "Sign Out", icon: LogOut, href: "#" },
]

export default function ModernNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 font-sans">
        <div className="flex h-16 items-center justify-center relative px-4 md:px-6">
          {/* Left: Hamburger Menu */}
          <div className="absolute left-4 md:left-6 flex items-center">
            {/* Desktop Sidebar Trigger */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 font-medium transition-all duration-200 hover:bg-accent/80"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-2 border-primary/20 shadow-2xl ring-1 ring-black/5"
                  align="start"
                  side="bottom"
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-foreground mb-1">Navigation</h3>
                      <p className="text-xs text-muted-foreground">Quick access to all sections</p>
                    </div>
                    <nav className="space-y-1.5">
                      {navigationItems.map((item) => (
                        <DropdownMenuItem key={item.name} asChild className="p-0">
                          <a
                            href={item.href}
                            className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02] focus:bg-primary/10 focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98]"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <item.icon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold">{item.name}</span>
                                <span className="text-xs text-muted-foreground group-hover:text-primary/70">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </nav>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 font-medium">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-80 bg-white backdrop-blur-3xl supports-[backdrop-filter]:bg-white/95
                     border-r border-primary/10
                    dark:bg-black/30 dark:backdrop-blur-3xl dark:supports-[backdrop-filter]:bg-black/20
                    before:absolute before:inset-0 before:backdrop-blur-3xl before:-z-10"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="mt-6 px-6">
                    {/* Account Section with Dropdown - Black/White Theme */}
                    <div className="mb-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center justify-start space-x-3 my-8 mb-2 h-12 w-full focus:outline-none rounded-lg
                            bg-white text-black dark:bg-black dark:text-white">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Profile" />
                                <AvatarFallback className="font-medium">JD</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <span className="block text-base font-bold leading-none">John Doe</span>
                              <span className="block text-xs text-black/70 dark:text-white/70 truncate">john@example.com</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-black/60 dark:text-white/70" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full mt-2 bg-white text-black dark:bg-black dark:text-white border border-black/10 dark:border-white/20 shadow-xl">
                          {profileMenuItems.map((item) => (
                            <DropdownMenuItem key={item.name} asChild className="p-0">
                              <a
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                  hover:bg-black/5 hover:text-black focus:bg-black/10 focus:text-black
                                  dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white"
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0 text-black dark:text-white" />
                                <span>{item.name}</span>
                              </a>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>


                    <div className="mb-10">
                      {/* Removed navigation title and description */}
                    </div>


                    <nav className="space-y-3">
                      {navigationItems.map((item, index) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 mb-8
                            bg-white text-black dark:bg-black dark:text-white
                            hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white
                            hover:shadow-md hover:scale-[1.01] active:scale-[0.98]
                            focus:bg-black/10 focus:text-black dark:focus:bg-white/10 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                          style={{
                            animationDelay: `${index * 50}ms`,
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-black dark:bg-white/10 dark:text-white transition-all duration-200 group-hover:bg-black/10 group-hover:text-black dark:group-hover:bg-white/20 dark:group-hover:text-white group-hover:scale-105">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{item.name}</span>
                              <span className="text-xs text-black/60 group-hover:text-black/80 dark:text-white/70 dark:group-hover:text-white/90">
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-black/10 dark:bg-white/20 transition-colors group-hover:bg-black dark:group-hover:bg-white" />
                            <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 text-black dark:text-white" />
                          </div>
                        </a>
                      ))}
                    </nav>
                    {/* Branding moved to bottom */}
                    <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pb-6">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-primary/20 mb-2">
                        <Image
                          src="/brand.png"
                          alt="O2 Store Logo"
                          width={48}
                          height={48}
                          className="object-cover"
                          priority
                        />
                      </div>
                      <span className="text-lg font-bold tracking-tight">O2 Store</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Center: Brand */}
          <div className="flex items-center flex-1 justify-center">
            <a href="#" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
              <div className="relative h-9 w-9 rounded-xl overflow-hidden ring-2 ring-primary/20">
                <Image
                  src="/brand.png"
                  alt="O2 Store Logo"
                  width={36}
                  height={36}
                  className="object-cover"
                  priority
                />
              </div>
              {/* Desktop brand title */}
              <span className="hidden text-xl font-bold tracking-tight sm:inline-block">O2 Store</span>
              {/* Mobile brand title */}
              <span className="ml-0 text-lg font-bold tracking-tight md:hidden">O2 Store</span>
            </a>
          </div>

          {/* Right: Theme Toggle & Profile */}
          <div className="absolute right-4 md:right-6 flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 font-medium transition-all duration-200 hover:bg-accent/80 hover:rotate-12"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Desktop Profile with Hover + Focus Menu */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 transition-all duration-200 hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                  >
                    <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                      <AvatarFallback className="font-medium">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border border-border/50 shadow-2xl"
                  align="end"
                  side="bottom"
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                        <AvatarFallback className="font-medium">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">John Doe</p>
                        <p className="text-xs font-normal text-muted-foreground truncate">john@example.com</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  {profileMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild className="p-0">
                      <a
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground hover:translate-x-1 focus:bg-accent focus:text-accent-foreground"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}
