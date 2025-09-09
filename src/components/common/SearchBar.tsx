import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <div className="mb-6">
      <div className='relative'>
        <input
          type="text"
          placeholder="Search Pokémon by name, type, ID, or ability... (Press '/' to focus)"
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
            title="Clear search (Esc)"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
