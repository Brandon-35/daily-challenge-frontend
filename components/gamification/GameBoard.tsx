"use client"

import { 
  Star, 
  TrendingUp, 
  Award 
} from "lucide-react"

export function GameBoard() {
  return (
    <div className="bg-white dark:bg-zinc-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* User Progress Section */}
          <div className="flex items-center space-x-4">
            {/* Level */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Level 5
              </span>
            </div>

            {/* Points */}
            <div className="flex items-center space-x-2 text-purple-600">
              <Star className="h-5 w-5" />
              <span className="font-semibold">235 Points</span>
            </div>

            {/* Ranking */}
            <div className="flex items-center space-x-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Top 10%</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Start Quest
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600" 
            style={{ width: '65%' }}
          />
        </div>
      </div>
    </div>
  )
}