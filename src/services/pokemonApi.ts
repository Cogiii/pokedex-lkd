import { 
  Pokemon, 
  PokemonListItem, 
  PokemonApiResponse, 
  EvolutionChainResponse, 
  PokemonSpecies,
  Evolution 
} from '../types/pokemon';
import { API_CONFIG } from '../constants/pokemon';
import { extractIdFromUrl } from '../utils/helpers';

/**
 * Fetches a list of Pokemon from the API
 * @param limit - Number of Pokemon to fetch
 * @param offset - Number of Pokemon to skip
 * @returns Promise with Pokemon list response
 */
export const fetchPokemonList = async (
  limit: number = API_CONFIG.ITEMS_PER_PAGE,
  offset: number = 0
): Promise<PokemonApiResponse> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetches detailed Pokemon data
 * @param url - The Pokemon API URL
 * @returns Promise with Pokemon data
 */
export const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon details: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetches Pokemon species data
 * @param id - The Pokemon ID
 * @returns Promise with Pokemon species data
 */
export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon-species/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetches evolution chain data
 * @param url - The evolution chain URL
 * @returns Promise with evolution chain data
 */
export const fetchEvolutionChain = async (url: string): Promise<EvolutionChainResponse> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetches and processes evolution chain for a Pokemon
 * @param pokemon - The Pokemon to get evolution chain for
 * @returns Promise with array of evolutions
 */
export const fetchPokemonEvolutions = async (pokemon: Pokemon): Promise<Evolution[]> => {
  try {
    const speciesData = await fetchPokemonSpecies(pokemon.id);
    const evolutionData = await fetchEvolutionChain(speciesData.evolution_chain.url);
    
    const evolutions: Evolution[] = [];
    
    const extractEvolutions = (chain: any) => {
      const id = extractIdFromUrl(chain.species.url);
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
    
    // Fetch Pokemon details for each evolution to get sprites
    const evolutionsWithSprites = await Promise.all(
      evolutions.map(async (evolution) => {
        try {
          const pokemonData = await fetchPokemonDetails(`${API_CONFIG.BASE_URL}/pokemon/${evolution.id}`);
          return {
            ...evolution,
            sprites: {
              front_default: pokemonData.sprites.front_default
            }
          };
        } catch (error) {
          console.error(`Error fetching sprites for ${evolution.name}:`, error);
          return evolution; // Return without sprites if fetch fails
        }
      })
    );
    
    return evolutionsWithSprites;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return [];
  }
};
