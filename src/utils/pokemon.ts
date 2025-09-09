import { Pokemon } from '../types/pokemon';

/**
 * Searches a Pokemon based on the search term
 * @param pokemon - The Pokemon to search
 * @param term - The search term
 * @returns boolean indicating if the Pokemon matches the search
 */
export const searchPokemon = (pokemon: Pokemon, term: string): boolean => {
  if (!term) return true;
  
  const normalizedTerm = term.toLowerCase().trim();
  
  // Search by name
  const nameMatch = pokemon.name.toLowerCase().includes(normalizedTerm);
  
  // Search by ID (if term is numeric)
  const idMatch = !isNaN(Number(normalizedTerm)) && pokemon.id.toString().includes(normalizedTerm);
  
  // Search by type
  const typeMatch = pokemon.types.some(typeObj => 
    typeObj.type.name.toLowerCase().includes(normalizedTerm)
  );
  
  // Search by abilities
  const abilityMatch = pokemon.abilities?.some(abilityObj =>
    abilityObj.ability.name.toLowerCase().includes(normalizedTerm)
  ) || false;

  return nameMatch || idMatch || typeMatch || abilityMatch;
};

/**
 * Gets the animated sprite or falls back to the default sprite
 * @param pokemon - The Pokemon object
 * @returns The sprite URL
 */
export const getPokemonSprite = (pokemon: Pokemon): string => {
  return (
    pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
    pokemon.sprites?.front_default ||
    ''
  );
};

/**
 * Gets the high-quality artwork or falls back to the default sprite
 * @param pokemon - The Pokemon object
 * @returns The artwork URL
 */
export const getPokemonArtwork = (pokemon: Pokemon): string => {
  return (
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default ||
    ''
  );
};

/**
 * Formats a Pokemon ID with leading zeros
 * @param id - The Pokemon ID
 * @returns Formatted ID string
 */
export const formatPokemonId = (id: number): string => {
  return id.toString().padStart(3, '0');
};

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts height from decimeters to meters
 * @param height - Height in decimeters
 * @returns Height in meters
 */
export const convertHeight = (height: number): number => {
  return height / 10;
};

/**
 * Converts weight from hectograms to kilograms
 * @param weight - Weight in hectograms
 * @returns Weight in kilograms
 */
export const convertWeight = (weight: number): number => {
  return weight / 10;
};
