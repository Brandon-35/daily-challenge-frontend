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
    <nav className="w-72 border-r border-border/40 bg-card h-screen flex flex-col">
      <div className="p-6 border-b border-border/40">
        <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Daily Quest
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-accent/40",
                isActive && "bg-accent text-primary font-medium"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}