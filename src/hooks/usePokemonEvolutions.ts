import { useState, useCallback } from 'react';
import { Pokemon, Evolution } from '../types/pokemon';
import { fetchPokemonEvolutions } from '../services/pokemonApi';

/**
 * Custom hook for managing Pokemon evolutions
 */
export const usePokemonEvolutions = () => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvolutions = useCallback(async (pokemon: Pokemon) => {
    setLoading(true);
    try {
      const evolutionData = await fetchPokemonEvolutions(pokemon);
      setEvolutions(evolutionData);
    } catch (error) {
      console.error('Error fetching evolutions:', error);
      setEvolutions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEvolutions([]);
    setLoading(false);
  }, []);

  return {
    evolutions,
    loading,
    fetchEvolutions,
    reset,
  };
};
