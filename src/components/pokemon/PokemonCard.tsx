import { FC, useState } from 'react';
import { Pokemon } from '../../types/pokemon';
import { TYPE_COLORS } from '../../constants/pokemon';
import { formatPokemonId, capitalize, getPokemonSprite } from '../../utils/pokemon';

interface PokemonTypeBadgeProps {
  type: string;
  className?: string;
}

export const PokemonTypeBadge: FC<PokemonTypeBadgeProps> = ({ type, className = '' }) => {
  const colorClass = TYPE_COLORS[type as keyof typeof TYPE_COLORS] || 'bg-gray-400';

  return (
    <span
      className={`px-2 py-1 rounded-full text-white text-sm font-medium ${colorClass} ${className}`}
    >
      {capitalize(type)}
    </span>
  );
};

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
  onMouseEnter?: (pokemonId: number) => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
}

export const PokemonCard: FC<PokemonCardProps> = ({
  pokemon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered = false,
}) => {
  const [isCardClick, setIsCardClick] = useState(false);

  const cardClickHandler = () => {
    onClick(pokemon);
    setIsCardClick(true);
  };

  return (
    <div
      className="min-w-[250px] group flex flex-col items-center justify-center relative cursor-pointer"
      onClick={cardClickHandler}
      onMouseEnter={() => onMouseEnter?.(pokemon.id)}
      onMouseLeave={onMouseLeave}
    >
      {pokemon.sprites.front_default ?
        (
          <img
            src={isHovered ? getPokemonSprite(pokemon) : pokemon.sprites.front_default}
            alt={pokemon.name}
            className={`h-[100px] object-contain absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 z-10
                        transition-all duration-300
                        ${isHovered || isCardClick ? 'scale-110 -translate-y-14' : 'scale-100 -translate-y-12'}`}
          />

        ) : (
          <div
            className={`flex items-center justify-center w-15 h-15 bg-gray-200 text-gray-600 text-lg font-bold rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 z-10 
                        transition-all duration-300
                        ${isHovered ? 'scale-110 -translate-y-8' : 'scale-100 -translate-y-6'}`}
          >
            ?
          </div>
        )
      }

      <div className="w-full bg-white rounded-lg shadow-md p-4 pt-10 border-2 flex flex-col items-center justify-center relative transition-all duration-300 group-hover:shadow-xl group-hover:border-red-400">
        <h3 className="font-bold text-lg text-center capitalize text-gray-800 group-hover:text-red-500 transition-all duration-300 group-hover:text-xl">
          {pokemon.name}
        </h3>
        <div className="flex justify-center space-x-2 mt-2">
          {pokemon.types.map((type, index) => (
            <PokemonTypeBadge
              key={index}
              type={type.type.name}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
