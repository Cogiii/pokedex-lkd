import { PokemonType } from '../types/pokemon';

export const TYPE_COLORS: Record<PokemonType, string> = {
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

export const STAT_NAMES: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  'speed': 'Speed'
};

export const API_CONFIG = {
  BASE_URL: 'https://pokeapi.co/api/v2',
  ITEMS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  MAX_SEARCH_RESULTS: 50,
  MAX_LOADED_DURING_SEARCH: 200,
} as const;

export const KEYBOARD_SHORTCUTS = {
  FOCUS_SEARCH: '/',
  CLEAR_SEARCH: 'Escape',
} as const;
