import { useMemo } from 'react';
import { Pokemon } from '../types/pokemon';
import { searchPokemon } from '../utils/pokemon';

/**
 * Custom hook for filtering Pokemon based on search term
 */
export const usePokemonSearch = (pokemonList: Pokemon[], searchTerm: string): Pokemon[] => {
  return useMemo(() => {
    if (!searchTerm.trim()) {
      return pokemonList;
    }
    
    return pokemonList.filter(pokemon => searchPokemon(pokemon, searchTerm));
  }, [pokemonList, searchTerm]);
};
