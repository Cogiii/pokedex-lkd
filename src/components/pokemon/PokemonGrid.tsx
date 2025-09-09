import React from 'react';
import { Pokemon } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';

interface PokemonGridProps {
  pokemon: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  onPokemonHover?: (pokemonId: number) => void;
  onPokemonLeave?: () => void;
  hoveredPokemonId?: number | null;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  searchTerm?: string;
  loaderRef?: React.RefObject<HTMLDivElement | null>;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemon,
  onPokemonClick,
  onPokemonHover,
  onPokemonLeave,
  hoveredPokemonId,
  loading = false,
  loadingMore = false,
  hasMore = true,
  searchTerm = '',
  loaderRef,
}) => {
  if (loading && pokemon.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading Pokémon...</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4 gap-y-20 pt-5">
        {pokemon.map((poke) => (
          <PokemonCard
            key={poke.id}
            pokemon={poke}
            onClick={onPokemonClick}
            onMouseEnter={onPokemonHover}
            onMouseLeave={onPokemonLeave}
            isHovered={hoveredPokemonId === poke.id}
          />
        ))}
      </div>
      
      {/* Loader and Status Messages */}
      <div ref={loaderRef} className="flex justify-center items-center min-h-[60px]">
        {loadingMore && (
          <div className="flex flex-col items-center p-4">
            {/* Loading Spinner */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2"></div>
            <div className="text-gray-600 text-sm">
              {searchTerm 
                ? 'Loading more Pokémon to search...' 
                : 'Loading more Pokémon...'
              }
            </div>
          </div>
        )}
      </div>
      
      {searchTerm && pokemon.length === 0 && !loadingMore && (
        <div className="text-center p-8 text-gray-600">
          <div className="text-lg mb-2">No Pokémon found</div>
          <div className="text-sm">
            {hasMore 
              ? 'Loading more data to search... Scroll down for more results.'
              : 'Try searching by name, type, ID, or ability'
            }
          </div>
        </div>
      )}
    </>
  );
};
