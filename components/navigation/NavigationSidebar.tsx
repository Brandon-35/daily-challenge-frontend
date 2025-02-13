"use client"

import { 
  Home, 
  ClipboardList, 
  Bot, 
  Trophy, 
  Settings 
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  {
    title: "Dashboard",
    icon: Home,
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

export function NavigationSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white dark:bg-zinc-800 border-r dark:border-zinc-700 flex flex-col py-4">
      <TooltipProvider>
        <nav className="flex-1 flex flex-col space-y-2 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.path}
                    className={cn(
                      "p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors",
                      isActive && "bg-purple-100 dark:bg-purple-900 text-purple-600"
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5", 
                        isActive ? "text-purple-600" : "text-zinc-500 dark:text-zinc-400"
                      )}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-800 text-white">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </TooltipProvider>
    </aside>
  )
}