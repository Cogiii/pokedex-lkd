export interface Pokemon {
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
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          animated?: {
            front_default?: string;
          };
        };
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

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Evolution {
  name: string;
  id: number;
  sprites?: {
    front_default?: string;
  };
}

export interface PokemonApiResponse {
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
}

export interface EvolutionChainResponse {
  chain: EvolutionChain;
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
}

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';
