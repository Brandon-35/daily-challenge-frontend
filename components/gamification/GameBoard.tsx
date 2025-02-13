// components/gamification/GameBoard.tsx
import { Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

export function GameBoard() {
  return (
    <Card className="w-full p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg">Today's Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Level 5</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <span>235 Points</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button>Start Challenge</Button>
          <Button variant="outline">View History</Button>
        </div>
      </div>
      <Progress value={45} className="mt-4" />
    </Card>
  )
}