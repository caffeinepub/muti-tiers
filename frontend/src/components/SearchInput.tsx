import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search player...' }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-mc-muted pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-mc-input border border-mc-border rounded text-mc-text placeholder-mc-muted text-sm pl-9 pr-8 py-1.5 w-48 focus:outline-none focus:border-mc-gold focus:ring-1 focus:ring-mc-gold transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 text-mc-muted hover:text-mc-text transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      <span className="absolute right-2 text-mc-muted text-xs pointer-events-none" style={{ display: value ? 'none' : 'block' }}>
        /
      </span>
    </div>
  );
}
