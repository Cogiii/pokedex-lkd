'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";

import Logo from '../public/pokemon-logo.png';

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  height: number;
  weight: number;
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
  species: {
    evolution_chain: {
      url: string;
    };
  };
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface Evolution {
  name: string;
  id: number;
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-500',
  fire: 'bg-red-600',
  water: 'bg-blue-600',
  electric: 'bg-yellow-500',
  grass: 'bg-green-600',
  ice: 'bg-blue-400',
  fighting: 'bg-red-800',
  poison: 'bg-purple-600',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-500',
  psychic: 'bg-pink-600',
  bug: 'bg-green-600',
  rock: 'bg-yellow-900',
  ghost: 'bg-purple-800',
  dragon: 'bg-indigo-800',
  dark: 'bg-gray-900',
  steel: 'bg-gray-600',
  fairy: 'bg-pink-400',
};

export default function Pokedex() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pokemonEvolutions, setPokemonEvolutions] = useState<Evolution[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const [isHoveredPokemonId, setIsHoveredPokemonId] = useState<number | null>(null);

  useEffect(() => {
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.types.some(type => type.type.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, pokemonList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          fetchPokemonList();
        }
      },
      {
        root: null,
        threshold: 1,
        rootMargin: "0px 0px 300px 0px",
      }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      observer.disconnect();
    };
  }, [loadingMore, hasMore]);

  const fetchPokemonList = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pokemonList.length}`
      );
      const data = await response.json();

      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: PokemonListItem) => {
          const pokemonResponse = await fetch(pokemon.url);
          return await pokemonResponse.json();
        })
      );

      setPokemonList((prev) => [...prev, ...pokemonDetails]);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  function fetchPokemonGif(pokemon: any) {
    return (
      pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
      pokemon.sprites?.front_default
    );
  }

  const fetchEvolutionChain = async (pokemon: Pokemon) => {
    try {
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      const speciesData = await speciesResponse.json();

      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      const evolutions: Evolution[] = [];

      const extractEvolutions = (chain: any) => {
        const id = parseInt(chain.species.url.split('/')[6]);
        evolutions.push({
          name: chain.species.name,
          id: id
        });

        if (chain.evolves_to.length > 0) {
          chain.evolves_to.forEach((evolution: any) => {
            extractEvolutions(evolution);
          });
        }
      };

      extractEvolutions(evolutionData.chain);
      setPokemonEvolutions(evolutions);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      setPokemonEvolutions([]);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    fetchEvolutionChain(pokemon);
  };

  const formatStatName = (statName: string) => {
    const statNames: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      'speed': 'Speed'
    };
    return statNames[statName] || statName;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen flex items-center justify-center bg-white">
        <Image src={Logo} alt="Pokemon Logo" width={200} height={200} className='animate-spin' />
        <div className="text-2xl font-bold text-black">Loading Pokédex...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between bg-red-600 text-white p-4 px-10 shadow-lg">
        <div className='flex gap-4 items-center'>
          <img src="/pokemon-logo.png" alt="" className='w-12' />
          <h1 className="text-2xl font-bold text-center">Pokédex</h1>
        </div>

        <a href="https://github.com/Cogiii/pokedex-lkd" target="_blank" rel="noopener noreferrer" className="self-center">
          GitHub
        </a>
      </header>

      <div className="container mx-auto p-10 px-4 md:px-10 lg:px-30">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Pokemon List */}
          <div className={`${selectedPokemon ? 'lg:w-2/2' : 'w-full'}`}>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search Pokémon by name or type..."
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Pokémon List</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4 gap-y-20 pt-5">
              {filteredPokemon.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="group flex flex-col items-center justify-center relative cursor-pointer"
                  onClick={() => handlePokemonClick(pokemon)}
                  onMouseEnter={() => setIsHoveredPokemonId(pokemon.id)}
                  onMouseLeave={() => setIsHoveredPokemonId(null)}
                >
                  <Image
                    src={
                      isHoveredPokemonId === pokemon.id
                        ? fetchPokemonGif(pokemon)
                        : pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                    width={100}
                    height={100}
                    className="h-[100px] object-contain absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-14"
                  />
                  <div
                    className="w-full bg-white rounded-lg shadow-md p-4 pt-10 border-2 flex flex-col items-center justify-center relative transition-all duration-300 group-hover:shadow-xl group-hover:border-red-400"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-center capitalize text-gray-800 group-hover:text-red-500 transition-all duration-300 group-hover:text-xl">
                        {pokemon.name}
                      </h3>
                      <div className="flex justify-center space-x-2 mt-2">
                        {pokemon.types.map((type, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-lg text-white text-sm font-medium 
                                      ${typeColors[type.type.name] || 'bg-gray-400'}
                                      transition-transform duration-300 group-hover:scale-105`}
                          >
                            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={loader} className="h-10" />
            </div>
          </div>

          {/* Pokemon Details */}
          {selectedPokemon && (
            <div className="md:w-[400px] lg:w-[400px] sticky top-35 self-start bg-white rounded-t-4xl shadow-lg p-6 pt-20 flex flex-col h-[100vh]">
              <Image
                src={fetchPokemonGif(selectedPokemon)}
                alt={selectedPokemon.name}
                height={120}
                width={120}
                unoptimized
                className="absolute -top-10 left-1/3 mx-auto object-contain h-[120px]"
              />
              <div className="overflow-y-scroll no-scrollbar h-[65vh]">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold capitalize text-gray-800 mt-1">
                    {selectedPokemon.name}
                  </h2>
                  <p className='text-black'>ID: {selectedPokemon.id.toString().padStart(3, '0')}</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    {selectedPokemon.types.map((type, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-lg text-white font-medium ${typeColors[type.type.name] || 'bg-gray-400'
                          }`}
                      >
                        {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-gray-600">Height</p>
                    <p className="text-l font-bold text-gray-800">{selectedPokemon.height / 10} m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Weight</p>
                    <p className="text-l font-bold text-gray-800">{selectedPokemon.weight / 10} kg</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Base Stats</h3>
                  <div className="space-y-2">
                    {selectedPokemon.stats.map((stat, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-20 text-sm font-medium text-gray-600">
                          {formatStatName(stat.stat.name)}
                        </div>
                        <div className="w-12 text-sm font-bold text-gray-800">
                          {stat.base_stat}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.abilities.map((ability, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
                      >
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evolution Chain */}
                {pokemonEvolutions.length > 1 && (
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Evolution Chain</h3>
                    <div className="flex items-center flex-wrap gap-2">
                      {pokemonEvolutions.map((evolution, index) => {
                        const evolutionPokemon = pokemonList.find(p => p.id === evolution.id);

                        return (
                          <React.Fragment key={index}>
                            {/* Evolution Item */}
                            <div
                              className="flex flex-col ml-1 items-center cursor-pointer transition-transform hover:scale-105"
                              onClick={() => evolutionPokemon && handlePokemonClick(evolutionPokemon)}
                            >
                              {evolutionPokemon?.sprites?.front_default ? (
                                <Image
                                  src={evolutionPokemon.sprites.front_default}
                                  alt={evolution.name}
                                  width={50}
                                  height={50}
                                  className={`object-contain w-[100%] mb-1 ${evolution.id === selectedPokemon.id ? 'ring-4 ring-red-500 rounded-full' : ''
                                    }`}
                                />
                              ) : (
                                <div
                                  className={`flex items-center justify-center w-10 h-10 ml-2 mb-1 bg-gray-200 text-gray-600 text-lg font-bold rounded-full ${evolution.id === selectedPokemon.id ? 'ring-4 ring-red-500' : ''
                                    }`}
                                >
                                  ?
                                </div>
                              )}

                              <span
                                className={`capitalize text-[8px] font-medium ${evolution.id === selectedPokemon.id ? 'text-red-500 font-bold' : 'text-gray-800'
                                  }`}
                              >
                                {evolution.name}
                              </span>
                            </div>

                            {/* Arrow between evolutions */}
                            {index < pokemonEvolutions.length - 1 && (
                              <span className="text-gray-500 text-lg">→</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
