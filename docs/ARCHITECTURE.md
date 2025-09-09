# Project Structure

This project follows modern React/Next.js best practices with a clean, maintainable folder structure.

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Header, Loading, SearchBar)
│   └── pokemon/        # Pokemon-specific components
├── constants/          # Application constants and configuration
├── hooks/             # Custom React hooks
├── services/          # API calls and external services
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities

app/                   # Next.js App Router
├── page.tsx          # Main page component (refactored)
├── page-old.tsx      # Original monolithic component (backup)
├── layout.tsx        # App layout
└── globals.css       # Global styles

public/               # Static assets
```

## 🧩 Component Architecture

### **Common Components**
- `Loading.tsx` - Loading states with Pokemon logo
- `Header.tsx` - App header with navigation
- `SearchBar.tsx` - Search input with clear functionality

### **Pokemon Components** 
- `PokemonCard.tsx` - Individual Pokemon card with type badges
- `PokemonGrid.tsx` - Grid layout with infinite scroll
- `PokemonDetails.tsx` - Detailed Pokemon information panel

## 🎣 Custom Hooks

- `usePokemonList` - Manages Pokemon data fetching with infinite scroll
- `useDebounce` - Debounces search input for performance
- `usePokemonSearch` - Handles Pokemon filtering logic
- `useKeyboardShortcuts` - Manages keyboard shortcuts (/, Esc)
- `usePokemonEvolutions` - Handles evolution chain fetching

## 🛠️ Services

- `pokemonApi.ts` - All Pokemon API calls centralized
- Clean separation of data fetching from UI logic

## 📝 Types

- Comprehensive TypeScript definitions for all data structures
- Type safety throughout the application

## 🎯 Benefits of This Structure

### **Maintainability**
- Single Responsibility Principle
- Easy to locate and modify specific features
- Reusable components across the app

### **Scalability**
- Easy to add new features
- Components can be independently tested
- Clear dependencies and data flow

### **Developer Experience**
- IntelliSense and autocompletion
- Type safety prevents runtime errors
- Clear file organization

### **Performance**
- Optimized re-renders with proper memoization
- Efficient data fetching with custom hooks
- Code splitting ready

## 🚀 Development Guidelines

1. **Components** should be pure and focused on UI
2. **Hooks** should handle state and side effects
3. **Services** should handle API calls
4. **Types** should be shared and comprehensive
5. **Utils** should be pure functions with no side effects

## 📦 Import Patterns

```typescript
// Types
import { Pokemon, Evolution } from '@/types/pokemon';

// Hooks
import { usePokemonList } from '@/hooks/usePokemonList';

// Components
import { Header } from '@/components/common/Header';
import { PokemonCard } from '@/components/pokemon/PokemonCard';

// Services
import { fetchPokemonList } from '@/services/pokemonApi';

// Utils
import { searchPokemon } from '@/utils/pokemon';
```
