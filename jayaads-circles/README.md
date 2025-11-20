# Cubes vs Circles v0.6.1

A tower defense game where you defend against cubes using various cannons and lasers.

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Development Server

Start the local development server:

```bash
npm start
```

Or with auto-open in browser:

```bash
npm run dev
```

The game will be available at `http://localhost:8080`

### Development vs Production

- **Development**: Uses Node.js server for local testing (this setup)
- **Production**: GitHub Pages serves static files directly (no Node.js needed)

The Node.js setup is only for local development and won't affect GitHub Pages deployment.

## Project Structure

```
js/
├── core/           # Core game state
├── entities/       # Enemy, Building, Projectile classes
├── managers/       # Game managers (Spawn, Attack, Purchase, etc.)
└── utils/         # Constants and helper functions
```

## Game Controls

- Click buttons to purchase buildings and upgrades
- Buildings automatically attack enemies
- Defend against cubes reaching the edge!

