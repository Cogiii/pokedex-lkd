import { useState, useEffect, useCallback } from 'react';
import { Pokemon, PokemonListItem } from '../types/pokemon';
import { fetchPokemonList, fetchPokemonDetails } from '../services/pokemonApi';

interface UsePokemonListReturn {
  pokemonList: Pokemon[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for managing Pokemon list
 */
export const usePokemonList = (): UsePokemonListReturn => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemon = useCallback(async (offset: number = 0, isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    setError(null);

    try {
      const data = await fetchPokemonList(20, offset);
      
      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const pokemonDetails = await Promise.all(
        data.results.map((pokemon: PokemonListItem) => 
          fetchPokemonDetails(pokemon.url)
        )
      );

      setPokemonList(prev => isInitial ? pokemonDetails : [...prev, ...pokemonDetails]);
      setHasMore(data.next !== null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Pokemon';
      setError(errorMessage);
      console.error('Error fetching Pokemon:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await loadPokemon(pokemonList.length, false);
  }, [loadPokemon, loadingMore, hasMore, pokemonList.length]);

  const reset = useCallback(() => {
    setPokemonList([]);
    setLoading(true);
    setLoadingMore(false);
    setHasMore(true);
    setError(null);
    loadPokemon(0, true);
  }, [loadPokemon]);

  useEffect(() => {
    loadPokemon(0, true);
  }, [loadPokemon]);

  return {
    pokemonList,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    reset,
  };
};
