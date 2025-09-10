# Pokédex

A modern, clean, and maintainable Pokédex web application built with Next.js and TypeScript.
View live demo [here](https://pokedex-lkd.vercel.app)

## Features

- **Advanced Search** - Search by name, type, ID, or ability with debouncing
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Infinite Scroll** - Smart loading with search integration
- **Performance Optimized** - Memoized components and efficient re-renders
- **Keyboard Shortcuts** - Press `/` to focus search, `Esc` to clear
- **Type Safety** - Full TypeScript coverage
- **Modular Architecture** - Clean, maintainable code structure

## Pokémon Information

- **Complete Stats** - HP, Attack, Defense, Special stats with visual bars
- **Abilities** - All Pokémon abilities displayed
- **Evolution Chain** - Interactive evolution tree
- **Physical Info** - Height and Weight
- **High-Quality Images** - Official artwork and animated sprites

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience  
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Custom hooks for state management
- **PokéAPI** - Comprehensive Pokémon data source

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks  
├── services/      # API calls and external services
├── types/         # TypeScript definitions
├── utils/         # Helper functions
└── constants/     # App configuration
```

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/Cogiii/pokedex-lkd.git
cd pokedex-lkd
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Performance Features

- **Debounced Search** - Prevents excessive API calls
- **Memoized Components** - Optimized re-renders
- **Smart Infinite Scroll** - Loads more data during search
- **Efficient State Management** - Custom hooks for clean logic

## Development

- **Clean Architecture** - Modular, maintainable code
- **Type Safety** - Comprehensive TypeScript coverage
- **Custom Hooks** - Reusable logic separation
- **Component Composition** - Flexible and testable components

## Documentation

See `docs/ARCHITECTURE.md` for detailed information about the project structure and development guidelines.

## API

This project uses the [PokéAPI](https://pokeapi.co/) for all Pokémon data.
