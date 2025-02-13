// components/navigation/NavigationBar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ClipboardList, Bot, Trophy, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Work Logs", 
    icon: ClipboardList,
    path: "/logs",
  },
  {
    title: "AI Review",
    icon: Bot,
    path: "/review", 
  },
  {
    title: "Rankings",
    icon: Trophy,
    path: "/rankings",
  },
  {
    title: "Settings",
    icon: Settings, 
    path: "/settings",
  }
]

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r bg-card px-3 py-4 hidden md:block">
      <div className="mb-8 px-4">
        <h1 className="font-bold text-xl">Daily Quest</h1>
      </div>
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive && "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}