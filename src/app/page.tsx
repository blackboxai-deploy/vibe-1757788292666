"use client";

import WeekPlanner from '@/components/WeekPlanner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Minimalistic Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Planner</h1>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <WeekPlanner />
      </div>
      
      {/* Bottom spacing */}
      <div className="pb-12"></div>
    </main>
  );
}