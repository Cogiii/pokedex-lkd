import { Fragment, FC } from 'react';
import Image from 'next/image';
import { Pokemon, Evolution } from '../../types/pokemon';
import { PokemonTypeBadge } from './PokemonCard';
import { STAT_NAMES } from '../../constants/pokemon';
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
  <div className="mb-6">
    <h3 className="text-xl font-bold mb-3 text-gray-800">Base Stats</h3>
    <div className="space-y-2">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center">
          <div className="w-20 text-sm font-medium text-gray-600">
            {STAT_NAMES[stat.stat.name] || capitalize(stat.stat.name)}
          </div>
          <div className="w-12 text-sm font-bold text-gray-800">
            {stat.base_stat}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${(stat.base_stat / 255) * 100}%` }}
            />
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
    <div className="flex flex-wrap gap-2">
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
    <div>
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
    </div>
  );
};

interface PokemonDetailsProps {
  pokemon: Pokemon;
  evolutions: Evolution[];
  onEvolutionClick: (evolutionId: number) => void;
}

export const PokemonDetails: FC<PokemonDetailsProps> = ({
  pokemon,
  evolutions,
  onEvolutionClick,
}) => {
  return (
    <div className="w-[400px] sticky top-30 self-start bg-white rounded-t-4xl shadow-lg p-6 pt-20 flex flex-col h-[calc(100vh-7.5rem)]">
      <Image
        src={getPokemonSprite(pokemon)}
        alt={pokemon.name}
        height={100}
        width={100}
        className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 z-10"
      />

      <div className="flex flex-col overflow-y-auto no-scrollbar h-[70vh]">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold capitalize text-gray-800">
            {pokemon.name}
          </h2>
          <p className='text-gray-600'>
            ID: {formatPokemonId(pokemon.id)}
          </p>
          <div className="flex justify-center space-x-2 mt-2">
            {pokemon.types.map((type, index) => (
              <PokemonTypeBadge key={index} type={type.type.name} className="px-3 py-1" />
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-gray-600">Height</p>
            <p className="text-xl font-bold text-gray-800">{convertHeight(pokemon.height)} m</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Weight</p>
            <p className="text-xl font-bold text-gray-800">{convertWeight(pokemon.weight)} kg</p>
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
