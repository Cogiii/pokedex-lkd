import { useState, Fragment, FC } from 'react';
import Image from 'next/image';
import { Pokemon, Evolution } from '../../types/pokemon';
import { PokemonTypeBadge } from './PokemonCard';
import { STAT_NAMES_SHORTCUTS } from '../../constants/pokemon';
import {
  formatPokemonId,
  capitalize,
  convertHeight,
  convertWeight,
  getPokemonSprite,
  getPokemonArtwork
} from '../../utils/pokemon';

interface PokemonStatsProps {
  stats: Pokemon['stats'];
}

const PokemonStats: FC<PokemonStatsProps> = ({ stats }) => (
  <div className="mb-6 w-full max-w-sm mx-auto lg:max-w-none">
    <h3 className="text-xl font-bold mb-3 text-gray-800">Base Stats</h3>
    <div className="flex justify-center gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Stat value */}
          <div className="text-xs lg:text-sm font-bold text-gray-800 mb-1">
            {stat.base_stat}
          </div>
          
          {/* Vertical Progress Bar */}
          <div className="w-3 lg:w-3 h-20 lg:h-24 bg-gray-200 rounded-full relative flex items-end">
            <div
              className="w-full bg-red-500 rounded-full transition-all duration-700 ease-out"
              style={{ height: `${(stat.base_stat / 255) * 100}%` }}
            />
          </div>
          
          {/* Stat name */}
          <div className="w-full text-xs lg:text-sm font-medium text-gray-600 text-center lg:text-left mt-2 max-w-[50px] lg:max-w-none">
            <span className="block">
              {STAT_NAMES_SHORTCUTS[stat.stat.name].slice(0,3)}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface PokemonAbilitiesProps {
  abilities: Pokemon['abilities'];
}

const PokemonAbilities: FC<PokemonAbilitiesProps> = ({ abilities }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold mb-3 text-gray-800">Abilities</h3>
    <div className="flex flex-wrap gap-2 justify-center">
      {abilities.map((ability, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
        >
          {ability.ability.name.replace('-', ' ')}
        </span>
      ))}
    </div>
  </div>
);

interface PokemonEvolutionsProps {
  evolutions: Evolution[];
  selectedPokemon: Pokemon;
  onEvolutionClick: (evolutionId: number) => void;
}

const PokemonEvolutions: FC<PokemonEvolutionsProps> = ({
  evolutions,
  selectedPokemon,
  onEvolutionClick
}) => {
  if (evolutions.length <= 1) return null;

  return (
    <>
      <h3 className="text-xl font-bold mb-3 text-gray-800">Evolution Chain</h3>
      <div className="flex items-center flex-wrap gap-2">
        {evolutions.map((evolution, index) => {
          return (
            <Fragment key={index}>
              {/* Evolution Item */}
              <div
                className="flex flex-col ml-2 items-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => onEvolutionClick(evolution.id)}
              >
                {evolution.sprites?.front_default ? (
                  <Image
                    src={evolution.sprites.front_default}
                    alt={evolution.name}
                    width={50}
                    height={50}
                    className={`object-contain w-[100%] mb-1 ${evolution.id === selectedPokemon.id ? 'ring-4 ring-red-500 rounded-full' : ''
                      }`}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center w-10 h-10 mb-1 bg-gray-200 text-gray-600 text-lg font-bold rounded-full ${evolution.id === selectedPokemon.id ? 'ring-4 ring-red-500' : ''
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
              {index < evolutions.length - 1 && (
                <span className="text-gray-500 text-lg">→</span>
              )}
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

interface PokemonDetailsProps {
  pokemon: Pokemon;
  evolutions: Evolution[];
  onEvolutionClick: (evolutionId: number) => void;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (isOpen: boolean) => void;
}

export const PokemonDetails: FC<PokemonDetailsProps> = ({
  pokemon,
  evolutions,
  onEvolutionClick,
  isDetailsOpen,
  setIsDetailsOpen
}) => {
  const closePanel = () => setIsDetailsOpen(false);

  return (
    <div
      className={`
        w-full lg:w-[400px]
        fixed lg:sticky
        left-0
        lg:top-30
        bottom-0
        z-50
        self-start
        bg-white
        rounded-t-[40px] lg:rounded-t-[50px]
        shadow-2xl
        p-6 pt-20
        flex flex-col
        h-[calc(100vh-7.5rem)]
        ${isDetailsOpen ? 'translate-y-0' : 'translate-y-[100vh] lg:translate-y-0'}
      `}
    >
      {/* Close button (mobile only) */}
      <button
        onClick={closePanel}
        className="absolute -top-5 right-3 lg:hidden text-white bg-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        ✕
      </button>

      {/* Pokemon sprite */}
      <Image
        src={getPokemonSprite(pokemon)}
        alt={pokemon.name}
        height={100}
        width={100}
        className="absolute -top-12 left-1/2 -translate-x-1/2 z-10"
      />

      {/* Scrollable content */}
      <div className="flex flex-col overflow-y-auto no-scrollbar h-[70vh] items-center w-full text-center">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold capitalize text-gray-800">
            {pokemon.name}
          </h2>
          <p className="text-gray-600">
            ID: {formatPokemonId(pokemon.id)}
          </p>
          <div className="flex justify-center space-x-2 mt-2">
            {pokemon.types.map((type, index) => (
              <PokemonTypeBadge
                key={index}
                type={type.type.name}
                className="px-3 py-1"
              />
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-gray-600">Height</p>
            <p className="text-xl font-bold text-gray-800">
              {convertHeight(pokemon.height)} m
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Weight</p>
            <p className="text-xl font-bold text-gray-800">
              {convertWeight(pokemon.weight)} kg
            </p>
          </div>
        </div>

        <PokemonStats stats={pokemon.stats} />
        <PokemonAbilities abilities={pokemon.abilities} />
        <PokemonEvolutions
          evolutions={evolutions}
          selectedPokemon={pokemon}
          onEvolutionClick={onEvolutionClick}
        />
      </div>
    </div>
  );
};