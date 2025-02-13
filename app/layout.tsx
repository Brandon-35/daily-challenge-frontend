// app/layout.tsx
import { NavigationBar } from "@/components/navigation/NavigationBar"
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
        <div className="min-h-screen bg-background flex">
          {/* Navigation Sidebar */}
          <NavigationBar />
          
          {/* Main Content */}
          <main className="flex-1 p-8 pt-2">
            {/* Game Status Board - Always visible */}
            <GameBoard />
            
            {/* Page Content */}
            <div className="mt-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}