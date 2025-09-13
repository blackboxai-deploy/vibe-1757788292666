"use client";

import { useState, useRef, useEffect } from 'react';
import { DayOfWeek, DAYS_OF_WEEK } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import TodoList from './TodoList';

export default function WeekPlanner() {
  const todos = useTodos();
  const [activeDay, setActiveDay] = useState<DayOfWeek>(getCurrentDay());
  const [isScrolling, setIsScrolling] = useState(false);
   const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (todos.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

   const handleDaySelect = (day: DayOfWeek) => {
    setActiveDay(day);
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set timeout to stop scrolling animation
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    const currentIndex = DAYS_OF_WEEK.findIndex(d => d.key === activeDay);
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : DAYS_OF_WEEK.length - 1;
      handleDaySelect(DAYS_OF_WEEK[prevIndex].key);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = currentIndex < DAYS_OF_WEEK.length - 1 ? currentIndex + 1 : 0;
      handleDaySelect(DAYS_OF_WEEK[nextIndex].key);
    }
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex gap-8">
      {/* Vertical Day Slider Roller */}
      <div className="flex-shrink-0">
        <div className="sticky top-24">
          {/* Week Title */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-1">This Week</h2>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </p>
          </div>

           {/* Vertical Day Roller */}
          <div 
            className={`
              relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden
              transition-all duration-300 ${isScrolling ? 'scale-105 shadow-xl' : ''}
              focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2
            `}
            onKeyDown={handleKeyNavigation}
            tabIndex={0}
          >
            {/* Active day background slider */}
            <div 
              className={`
                absolute left-0 w-full h-16 bg-gradient-to-r from-black to-gray-800 
                transition-all duration-500 ease-out rounded-lg m-1
                ${isScrolling ? 'shadow-lg' : 'shadow-md'}
              `}
              style={{
                transform: `translateY(${DAYS_OF_WEEK.findIndex(d => d.key === activeDay) * 64 + 4}px)`,
                height: '56px',
                width: 'calc(100% - 8px)'
              }}
            />
            
            {/* Day buttons */}
            <div className="relative z-10 p-1 space-y-1">
              {DAYS_OF_WEEK.map((day, index) => {
                const totalTodos = todos.getTotalTodosForDay(day.key);
                const completedTodos = todos.getCompletedTodosForDay(day.key);
                const isActive = activeDay === day.key;
                const isToday = day.key === getCurrentDay();
                const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

                return (
                  <button
                    key={day.key}
                    onClick={() => handleDaySelect(day.key)}
                    className={`
                      w-full h-14 px-4 py-2 rounded-lg transition-all duration-300 
                      flex items-center justify-between group relative
                      ${isActive 
                        ? 'text-white' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {/* Day info */}
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }
                      `}>
                        {day.short.charAt(0)}
                      </div>
                      
                      <div className="text-left">
                        <div className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                          {day.short}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                          {getDateForDay(day.key).getDate()}
                        </div>
                      </div>
                    </div>

                    {/* Task indicator and today marker */}
                    <div className="flex items-center space-x-2">
                      {isToday && (
                        <div className={`
                          w-2 h-2 rounded-full animate-pulse
                          ${isActive ? 'bg-green-300' : 'bg-green-500'}
                        `}></div>
                      )}
                      
                      {totalTodos > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className={`
                            text-xs font-medium
                            ${isActive ? 'text-white/90' : 'text-gray-500'}
                          `}>
                            {completedTodos}/{totalTodos}
                          </span>
                          <div className={`
                            w-8 h-1 rounded-full overflow-hidden
                            ${isActive ? 'bg-white/20' : 'bg-gray-200'}
                          `}>
                            <div 
                              className={`
                                h-full transition-all duration-500
                                ${isActive ? 'bg-white' : 'bg-gray-800'}
                              `}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hover indicator */}
                    {!isActive && (
                      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom stats */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Week Progress</div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-500"
                      style={{ 
                        width: `${DAYS_OF_WEEK.reduce((acc, day) => {
                          const total = todos.getTotalTodosForDay(day.key);
                          const completed = todos.getCompletedTodosForDay(day.key);
                          return acc + (total > 0 ? (completed / total) * 100 : 100);
                        }, 0) / 7}%`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {Math.round(DAYS_OF_WEEK.reduce((acc, day) => {
                      const total = todos.getTotalTodosForDay(day.key);
                      const completed = todos.getCompletedTodosForDay(day.key);
                      return acc + (total > 0 ? (completed / total) * 100 : 100);
                    }, 0) / 7)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

           {/* Navigation hints */}
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs text-gray-400">Click to navigate days</p>
            <p className="text-xs text-gray-300">↑↓ or ←→ to scroll</p>
          </div>
        </div>
      </div>

       {/* Active Day Content */}
      <div className="flex-1 min-w-0">
        {/* Active Day Display */}
        {(() => {
          const activeDayData = DAYS_OF_WEEK.find(d => d.key === activeDay);
          if (!activeDayData) return null;

          const totalTodos = todos.getTotalTodosForDay(activeDay);
          const completedTodos = todos.getCompletedTodosForDay(activeDay);
          const isToday = activeDay === getCurrentDay();
          const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
          
          // Color scheme for each day
          const dayColors = {
            monday: { bg: 'bg-blue-50', border: 'border-blue-100', accent: 'bg-blue-500', text: 'text-blue-700' },
            tuesday: { bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'bg-emerald-500', text: 'text-emerald-700' },
            wednesday: { bg: 'bg-purple-50', border: 'border-purple-100', accent: 'bg-purple-500', text: 'text-purple-700' },
            thursday: { bg: 'bg-orange-50', border: 'border-orange-100', accent: 'bg-orange-500', text: 'text-orange-700' },
            friday: { bg: 'bg-pink-50', border: 'border-pink-100', accent: 'bg-pink-500', text: 'text-pink-700' },
            saturday: { bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'bg-indigo-500', text: 'text-indigo-700' },
            sunday: { bg: 'bg-red-50', border: 'border-red-100', accent: 'bg-red-500', text: 'text-red-700' }
          };

          const colors = dayColors[activeDay];

          return (
            <div 
              key={activeDay}
              className="animate-in slide-in-from-right duration-300 fade-in"
            >
              {/* Active Day Compartment */}
              <div className={`
                ${colors.bg} ${colors.border} border-2 rounded-xl overflow-hidden
                shadow-lg transition-all duration-500 hover:shadow-xl
                ${isToday ? 'ring-2 ring-black ring-offset-4 scale-[1.01]' : ''}
                ${isScrolling ? 'scale-[1.02] shadow-2xl' : ''}
              `}>
                
                {/* Day Header with Color Strip */}
                <div className="relative">
                  {/* Color accent strip with animation */}
                  <div className={`${colors.accent} h-2 w-full transition-all duration-300`}>
                    <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                  
                  {/* Header content */}
                  <div className="bg-white px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        {/* Day icon with animation */}
                        <div className={`
                          w-16 h-16 ${colors.bg} ${colors.border} border-2 rounded-xl 
                          flex items-center justify-center transition-all duration-300
                          ${isScrolling ? 'scale-110 shadow-lg' : ''}
                        `}>
                          <span className={`text-2xl font-bold ${colors.text}`}>
                            {activeDayData.short.charAt(0)}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-3xl font-semibold text-gray-900">
                              {activeDayData.label}
                            </h3>
                            {isToday && (
                              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium animate-pulse">
                                Today
                              </span>
                            )}
                          </div>
                          <p className="text-base text-gray-600 mt-2">
                            {getDateForDay(activeDay).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Progress section */}
                      <div className="text-right">
                        {totalTodos > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-semibold text-gray-700">
                                {completedTodos}/{totalTodos} tasks
                              </span>
                              <div className={`
                                w-4 h-4 rounded-full transition-all duration-300
                                ${completedTodos === totalTodos ? 'bg-green-500 animate-pulse' : colors.accent}
                              `}></div>
                            </div>
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full ${colors.accent} transition-all duration-700 ease-out`}
                                style={{ width: `${progressPercentage}%` }}
                              >
                                <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-base text-gray-400">No tasks yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Content Area */}
                <div className="bg-white px-8 py-6 min-h-[400px]">
                  <TodoList day={activeDay} todos={todos} dayColor={colors.accent} />
                </div>

                {/* Day Footer Stats */}
                {totalTodos > 0 && (
                  <div className={`${colors.bg} px-8 py-4 border-t border-gray-100`}>
                    <div className="flex justify-between items-center">
                      <div className={`${colors.text} font-semibold text-base`}>
                        {completedTodos === totalTodos ? '🎉 All tasks completed!' : 
                         `${totalTodos - completedTodos} tasks remaining`}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {Math.round(progressPercentage)}% complete
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function getCurrentDay(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return daysMap[dayIndex] as DayOfWeek;
}

function getDateForDay(day: DayOfWeek): Date {
  const today = new Date();
  const todayIndex = today.getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetIndex = daysMap.indexOf(day);
  const diffDays = targetIndex - todayIndex;
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diffDays);
  return targetDate;
}