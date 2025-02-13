import { NavigationSidebar } from "@/components/navigation/NavigationSidebar"
import { GameBoard } from "@/components/gamification/GameBoard"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
          {/* Sidebar Navigation */}
          <NavigationSidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {/* Game Board as a Top Panel */}
            <div className="w-full">
              <GameBoard />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}