"use client";

import { useState } from 'react';
import { DayOfWeek, Todo } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import TodoItem from './TodoItem';

interface TodoListProps {
  day: DayOfWeek;
  todos: ReturnType<typeof useTodos>;
  dayColor?: string;
}

export default function TodoList({ day, todos, dayColor = 'bg-black' }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const dayTodos = todos.getTodosForDay(day);
  const sortedTodos = [...dayTodos].sort((a, b) => {
    // Sort by completed status first (incomplete first), then by creation date
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      todos.addTodo(day, newTodoText, 'medium');
      setNewTodoText('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTodoText('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Add Todo Form */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors py-2 text-sm group"
        >
          <div className="w-4 h-4 border border-gray-300 rounded group-hover:border-gray-400 flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span>Add task</span>
        </button>
      ) : (
        <form onSubmit={handleAddTodo} className="flex items-center space-x-2">
          <div className="w-4 h-4 border border-gray-300 rounded flex-shrink-0"></div>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400 py-1"
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTodoText('');
              }}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTodoText.trim()}
              className={`text-xs ${dayColor} text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-all`}
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Todo Items */}
      <div className="space-y-1">
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            day={day}
            onToggle={() => todos.toggleTodo(day, todo.id)}
            onUpdate={(updates) => todos.updateTodo(day, todo.id, updates)}
            onDelete={() => todos.deleteTodo(day, todo.id)}
            dayColor={dayColor}
          />
        ))}
      </div>

      {/* Quick Actions */}
      {sortedTodos.length > 0 && todos.getCompletedTodosForDay(day) > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => todos.clearAllCompleted(day)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear completed ({todos.getCompletedTodosForDay(day)})
          </button>
        </div>
      )}
    </div>
  );
}