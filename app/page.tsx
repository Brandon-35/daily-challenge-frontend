// app/page.tsx
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-purple-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-purple-600">
          Welcome to Daily Quest!
        </h1>
        <p className="mt-3 text-2xl text-gray-600">
          Start your daily challenge now
        </p>
        <div className="mt-6">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </main>
    </div>
  )
}