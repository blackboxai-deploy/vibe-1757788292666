"use client";

import { useState } from 'react';
import { Todo, DayOfWeek } from '@/lib/types';

interface TodoItemProps {
  todo: Todo;
  day: DayOfWeek;
  onToggle: () => void;
  onUpdate: (updates: Partial<Todo>) => void;
  onDelete: () => void;
  dayColor?: string;
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete, dayColor = 'bg-black' }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate({
        text: editText.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="group flex items-center space-x-2 py-1">
      {!isEditing ? (
        <>
          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={`
              flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center
              transition-all duration-200
              ${todo.completed
                ? `${dayColor} border-current text-white`
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            {todo.completed && (
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`
              text-sm leading-relaxed
              ${todo.completed 
                ? 'text-gray-400 line-through' 
                : 'text-gray-700'
              }
            `}>
              {todo.text}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        // Edit Mode
        <div className="flex-1 flex items-center space-x-2">
          <div className="w-4 h-4 border border-gray-300 rounded flex-shrink-0"></div>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-sm py-1"
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              onClick={handleCancelEdit}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
              className={`text-xs ${dayColor} text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-all`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}