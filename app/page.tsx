'use client';

import { useState, useCallback, useRef, useEffect, use } from 'react';
import { Pokemon } from '../src/types/pokemon';
import { API_CONFIG } from '../src/constants/pokemon';
import { usePokemonList } from '../src/hooks/usePokemonList';
import { useDebounce } from '../src/hooks/useDebounce';
import { usePokemonSearch } from '../src/hooks/usePokemonSearch';
import { useKeyboardShortcuts } from '../src/hooks/useKeyboardShortcuts';
import { usePokemonEvolutions } from '../src/hooks/usePokemonEvolutions';
import { Loading } from '../src/components/common/Loading';
import { Header } from '../src/components/common/Header';
import { SearchBar } from '../src/components/common/SearchBar';
import { PokemonGrid } from '../src/components/pokemon/PokemonGrid';
import { PokemonDetails } from '../src/components/pokemon/PokemonDetails';

export default function Pokedex() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [hoveredPokemonId, setHoveredPokemonId] = useState<number | null>(null);
  const [isReset, setIsReset] = useState(false);
  const [loadingStateDetails, setLoadingStateDetails] = useState(false);

  // Custom hooks
  const { pokemonList, loading, loadingMore, hasMore, loadMore, reset } = usePokemonList();
  const debouncedSearchTerm = useDebounce(searchTerm);
  const filteredPokemon = usePokemonSearch(pokemonList, debouncedSearchTerm);
  const { evolutions, fetchEvolutions } = usePokemonEvolutions();

  // Refs
  const loaderRef = useRef<HTMLDivElement>(null);

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleSearchReset = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handlePokemonClick = useCallback(async (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    await fetchEvolutions(pokemon);
  }, [fetchEvolutions]);

  const handleEvolutionClick = useCallback((evolutionId: number) => {
    const evolutionPokemon = pokemonList.find(p => p.id === evolutionId);
    if (evolutionPokemon) {
      handlePokemonClick(evolutionPokemon);
    }
  }, [pokemonList, handlePokemonClick]);

  const handlePokemonHover = useCallback((pokemonId: number) => {
    setHoveredPokemonId(pokemonId);
  }, []);

  const handlePokemonLeave = useCallback(() => {
    setHoveredPokemonId(null);
  }, []);

  // Intersection Observer logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          // Smart loading logic
          if (debouncedSearchTerm) {
            const shouldLoadMoreDuringSearch =
              filteredPokemon.length < API_CONFIG.MAX_SEARCH_RESULTS ||
              pokemonList.length < API_CONFIG.MAX_LOADED_DURING_SEARCH;

            if (shouldLoadMoreDuringSearch) {
              loadMore();
            }
          } else {
            loadMore();
          }
        }
      },
      {
        root: null,
        threshold: 1,
        rootMargin: "0px 0px 200px 0px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadingMore, hasMore, debouncedSearchTerm, filteredPokemon.length, pokemonList.length, loadMore]);

  useEffect(() => {
    if(debouncedSearchTerm) return setIsReset(true);

    if (!debouncedSearchTerm && isReset) {
      reset();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setLoadingStateDetails(loading || !hasMore || debouncedSearchTerm !== '');
  }, [hasMore, loading, debouncedSearchTerm]);

  useKeyboardShortcuts({
    searchTerm,
    onClearSearch: handleSearchReset,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto p-4 pb-0">
        <div className={`flex flex-col lg:flex-row gap-6 ${loadingStateDetails ? 'h-screen' : ''}`}>
          {/* Pokemon List */}
          <div className={`${selectedPokemon ? 'lg:w-2/2' : 'w-full'}`}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClearSearch={handleSearchReset}
            />

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Pokémon List
              {debouncedSearchTerm && searchTerm &&
                (
                  <span className='text-sm text-gray-400 ml-2'>
                    {`(${filteredPokemon.length}) Pokémon`}
                  </span>
                )
              }
            </h2>

            <PokemonGrid
              pokemon={filteredPokemon}
              onPokemonClick={handlePokemonClick}
              onPokemonHover={handlePokemonHover}
              onPokemonLeave={handlePokemonLeave}
              hoveredPokemonId={hoveredPokemonId}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              searchTerm={debouncedSearchTerm}
              loaderRef={loaderRef}
            />
          </div>

          {/* Pokemon Details */}
          {selectedPokemon && (
            <PokemonDetails
              pokemon={selectedPokemon}
              evolutions={evolutions}
              onEvolutionClick={handleEvolutionClick}
            />
          )}
        </div>
      </div>
    </div >
  );
}
