# Game Architecture Documentation

## Overview

Cubes vs Circles is a tower defense game where players place towers to defend against waves of enemies. The game uses a modular OOP architecture with ES6 modules.

## Core Systems

### Game Loop (`js/game.js`)
The main game loop uses `requestAnimationFrame` with time accumulation to maintain consistent 50 FPS regardless of browser throttling.

**Key Functions:**
- `timeBasedGameLoop()`: Handles frame timing and speed multiplier
- `gameLoop()`: Core game update (spawning, movement, attacks, rendering)
- `startNewGame()`: Resets all game state and initializes wave manager

### Game State (`js/core/GameState.js`)
Centralized state management for:
- Resources: money, lives, round
- Upgrades: canonLevel, laserLevel, utilityLevel
- Game flow: isPaused, isMenuOpen, difficulty
- Statistics: kills, moneyEarned, totalDamage, etc.

**Important Methods:**
- `reset()`: Resets all state to initial values
- `startGame()`: Marks game as started, records start time
- `recordKill()`, `recordMoneyEarned()`, etc.: Track statistics

### Wave System (`js/utils/WaveSystem.js`)

**Wave Structure:**
```
{60 sec wait} [Part 1] {5 sec} [Part 2] {5 sec} [Part 3] {5 sec} [Part 4] {5 sec} [Part 5] {60 sec wait}
```

**Part Types:**
- **Normal**: 3-5 standard enemies
- **Swarm**: 8-20 standard enemies
- **Duplicate**: 3-8 enemies with identical modifiers
- **Boss**: 1 boss enemy (future implementation)

**Threat System:**
- Wave 1 = 100 THREAT
- Each wave multiplies by difficulty: NORMAL (1.1x), HARD (1.2x), VERY_HARD (1.3x)
- Threat divided equally among 5 parts
- Enemies cost threat based on level and modifiers

**Key Methods:**
- `shouldStartWave(currentTime)`: Checks if new wave should start
- `shouldSpawnPart(currentTime)`: Checks if next part should spawn
- `spawnEnemiesForPart()`: Generates enemy spawns for current part
- `isWaveComplete()`: Checks if all parts spawned

### Damage System (`js/utils/DamageSystem.js`)

**Damage Types:**
- Physical, Explosive, Poison, Magic, True, Electrical

**Resistance Formula:**
- R ≥ 0: `Damage Multiplier = 100 / (100 + R)`
- R < 0: `Damage Multiplier = 2 - 100 / (100 - R)`

**Penetration:**
- Percent penetration: Multiplicative (e.g., 20% + 20% = 0.8 × 0.8 = 0.64)
- Flat penetration: Subtracts after percent
- Final: `R_final = R_base × (percent_pen_product) - flat_pen`

**Critical Hits:**
- Crit chance: 0-100%
- Crit damage: Multiplier (default 100 = no bonus)
- Enemy Crit Block: Reduces crit chance by 1, crit damage by 2 (min 0)

**Key Class:**
- `DamageCalculator.calculateDamage(building, enemy)`: Main damage calculation

### Modifier System (`js/utils/ModifierSystem.js`)

**Modifier Rarities:**
- Common (white)
- Uncommon (green)
- Rare (blue)
- Epic (purple)
- Legendary (orange)

**Modifier Properties:**
- `threatMultiplier`: Multiplies enemy threat cost
- `effects`: Stat modifications (speed, size, resistances, etc.)
- `icon`: Display icon for UI

**Special Modifiers:**
- **Randomizer**: On death, transforms into random normal square with 3 modifiers
- **Ring Leader**: On death, spawns 4 unmodified copies
- **Speedster**: Dashes forward to map midpoint on spawn

**Key Class:**
- `ModifierManager.selectModifiers(threatBudget, maxModifiers)`: Selects modifiers within budget
- `ModifierManager.applyModifiers(enemy, modifiers)`: Applies modifier effects to enemy

### Enemy System (`js/entities/Enemy.js`)

**Enemy Levels:**
- Level 1-5 (from `ENEMY_LEVEL_TEMPLATES`)
- Higher levels: More HP, larger size, slower speed

**Enemy Properties:**
- `shape`: 'circle' (default) or 'hexagon' (fortified)
- `isFortified`: Boolean for fortified enemies
- `resistances`: Object mapping damage types to resistance values
- `critBlock`: Reduces incoming crit chance/damage
- `ccResist`: Reduces crowd control duration
- `dotResist`: Reduces DoT duration
- `durabilityBuff`: Multiplicative health multiplier

**Key Methods:**
- `takeDamage(damage, damageType, building)`: Applies damage with resistance calculations
- `applyModifiers(modifiers)`: Applies modifier effects
- `getMoneyReward()`: Calculates money reward on death
- `getLivesCost()`: Returns lives lost if enemy escapes

### Building System (`js/entities/Building.js`)

**Tower Categories:**
- **Damage**: Deals damage to enemies
- **Support**: Provides buffs/debuffs
- **Econ**: Generates money

**Tower Properties:**
- `damageFamily`: Primary damage type
- `damageTypes`: Object mapping damage types to multipliers
- `penetration`: Object with percent/flat penetration per type
- `critChance`: 0-100%
- `critDamage`: Multiplier (100 = no bonus)
- `fortifiedScaler`: Bonus damage vs fortified (1.0 = normal, 2.0 = double)
- `ccResist`: Reduces debuff duration
- `damageBuff`: Linear stacking damage multiplier

**Key Methods:**
- `addDamageBuff(multiplier)`: Adds damage buff (linear stacking)

## Manager Classes

### SpawnManager (`js/managers/SpawnManager.js`)
- Manages enemy and building arrays
- `spawnEnemyForWave(level, modifiers, isFortified)`: Creates enemy for wave system
- `spawnBuilding(typeId, x, y)`: Places building
- `canPlaceBuilding()`: Checks placement validity

### AttackManager (`js/managers/AttackManager.js`)
- Handles all tower attack logic
- `findEnemy()`: Finds target enemy (considers fortified scaler)
- `attackCannon()`, `attackLaser()`, etc.: Tower-specific attack methods
- Uses `DamageCalculator` for damage calculations

### CollisionManager (`js/managers/CollisionManager.js`)
- Circle-circle, circle-square, square-square collision
- `carCollision()`: Moving cannon collisions
- `pelletCollision()`: Pellet collisions

### PurchaseManager (`js/managers/PurchaseManager.js`)
- Handles building purchases and cost scaling
- `resetCosts()`: Resets all costs to initial values
- Each purchase method checks money and updates costs

### UpgradeManager (`js/managers/UpgradeManager.js`)
- Handles tower upgrades (cannons, lasers, utility)
- Updates building stats when upgrades purchased

### UIManager (`js/managers/UIManager.js`)
- Handles all rendering and UI updates
- `drawEnemy()`: Draws enemy with modifier icons and colored borders
- `drawBuilding()`: Draws building
- `showDeathPopup()`: Displays game summary
- `createMenu()`: Creates main menu with difficulty selector

### HighScoreManager (`js/managers/HighScoreManager.js`)
- Saves/loads high scores from localStorage
- Tracks best round, kills, money earned

## Utility Classes

### Constants (`js/utils/Constants.js`)
- All game constants, configurations, and templates
- `GAME_CONFIG`: Game settings
- `BUILDING_TYPES`: Tower definitions
- `ENEMY_LEVEL_TEMPLATES`: Enemy base stats by level
- `WAVE_CONFIG`: Wave system settings
- `MODIFIER_RARITY`, `MODIFIER_COLORS`: Modifier system constants

### Helpers (`js/utils/Helpers.js`)
- `PositionHelper`: Position calculations
- `CollisionHelper`: Collision detection utilities

### EnemyThreatCalculator (`js/utils/EnemyThreatCalculator.js`)
- `calculateThreatCost(level, modifiers)`: Calculates threat cost
- `getMaxSpawnCount()`: Calculates max enemies for threat budget

## Game Flow

1. **Menu**: Player selects difficulty, clicks "Start Game"
2. **Initialization**: `startNewGame()` resets state, creates `WaveManager`
3. **Wave Start**: 60-second delay, then first wave begins
4. **Part Spawning**: Enemies spawn in parts (5-second delays)
5. **Combat**: Towers attack enemies, enemies move toward goal
6. **Enemy Death**: Money awarded, stats updated
7. **Enemy Escape**: Lives lost, check game over
8. **Wave Complete**: 60-second delay, next wave
9. **Game Over**: Show death popup, save high score

## Key Design Patterns

1. **Manager Pattern**: Separate managers for different concerns
2. **Entity Pattern**: Enemy, Building, Projectile as classes
3. **Utility Pattern**: Static helper classes
4. **State Pattern**: Centralized GameState
5. **Module Pattern**: ES6 modules for organization

## Future Considerations

- Boss implementation
- More modifier types
- Tower upgrades affecting new stats
- Special enemy behaviors (Ring Leader, Randomizer, Speedster) implementation
- Attack system integration with new damage calculations

