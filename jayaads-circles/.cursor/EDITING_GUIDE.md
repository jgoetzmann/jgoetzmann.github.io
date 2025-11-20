# Editing Guide

## Quick Reference

### Adding a New Tower

1. **Define Tower in Constants** (`js/utils/Constants.js`):
```javascript
NEW_TOWER: {
    id: 20,
    name: "new tower",
    property: 1,
    size: 10,
    range: 100,
    attackSpeed: 30,
    damage: 50,
    targets: 1,
    category: TOWER_CATEGORIES.DAMAGE,
    damageFamily: DAMAGE_TYPES.PHYSICAL,
    damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0},
    penetration: {},
    critChance: 0,
    critDamage: 100,
    fortifiedScaler: 1.0,
    ccResist: 0
}
```

2. **Add Purchase Method** (`js/managers/PurchaseManager.js`):
```javascript
purchaseNewTower() {
    const cost = this.getCost('NEW_TOWER');
    if (this.gameState.money >= cost) {
        // Placement logic
        const placement = this.spawnManager.findBuildingPlacement(...);
        if (placement) {
            this.spawnManager.spawnBuilding(20, placement.x, placement.y);
            this.gameState.subtractMoney(cost);
            this.gameState.recordBuildingPlaced();
            this.incrementCost('NEW_TOWER');
            return true;
        }
    }
    return false;
}
```

3. **Add Attack Logic** (`js/managers/AttackManager.js`):
```javascript
// In processBuildingAttacks() or create new method
if (building.typeId === 20) {
    this.attackNewTower(building, enemies);
}
```

4. **Add UI Button** (`index.html`):
```html
<button id="button16" onclick="purchase16()">Buy New Tower! ($XXX)</button>
```

5. **Wire Up Function** (`js/game.js`):
```javascript
window.purchase16 = function() {
    if (purchaseManager.purchaseNewTower()) {
        uiManager.updateButtonText('button16', `Buy New Tower! ($${purchaseManager.getCost('NEW_TOWER')})`);
    }
};
```

6. **Add Color** (`js/utils/Constants.js`):
```javascript
BUILDING_COLORS[20] = "#colorcode";
```

### Adding a New Enemy Modifier

1. **Define Modifier** (`js/utils/ModifierSystem.js`):
```javascript
NEW_MODIFIER: {
    id: 'new_modifier',
    name: 'New Modifier',
    rarity: MODIFIER_RARITY.COMMON,
    threatMultiplier: 1.2,
    color: '#ffffff',
    icon: 'N',
    effects: {
        speed: 1.1,
        // Add stat modifications
    }
}
```

2. **Add to MODIFIERS Object**:
```javascript
export const MODIFIERS = {
    // ... existing modifiers
    NEW_MODIFIER: { /* ... */ }
};
```

3. **Update applyModifiers if Needed** (`js/utils/ModifierSystem.js`):
```javascript
// In ModifierManager.applyModifiers()
if (modifier.id === 'new_modifier') {
    // Special logic if needed
}
```

4. **Add Color if Needed**:
```javascript
MODIFIER_COLORS['new_modifier'] = '#colorcode';
```

### Modifying Damage Formulas

**Location**: `js/utils/DamageSystem.js`

**Main Method**: `DamageCalculator.calculateDamage(building, enemy)`

**Formula Structure**:
1. Get base damage from building
2. Apply damage buffs (linear stacking)
3. For each damage type:
   - Apply penetration (percent then flat)
   - Calculate resistance multiplier
   - Apply damage
4. Check for critical hit
5. Apply fortified scaler if applicable

**Example Change**:
```javascript
// To change resistance formula
static getDamageMultiplier(resistance) {
    // Your new formula here
    if (resistance >= 0) {
        return 100 / (100 + resistance);
    } else {
        return 2 - 100 / (100 - resistance);
    }
}
```

### Modifying Wave Spawning

**Location**: `js/utils/WaveSystem.js`

**Key Methods**:
- `spawnEnemiesForPart()`: Generates enemy spawns
- `chooseEnemyLevel()`: Selects enemy level based on threat
- `getPartType()`: Determines part type

**Example: Change Part Enemy Counts**:
```javascript
// In PART_CONFIGS
[PART_TYPES.NORMAL]: {
    enemyCount: {min: 5, max: 8}, // Changed from 3-5
    hasSpecialEffects: false
}
```

**Example: Change Threat Scaling**:
```javascript
// In WAVE_CONFIG
DIFFICULTY_MULTIPLIERS: {
    NORMAL: 1.15, // Changed from 1.1
    HARD: 1.25,   // Changed from 1.2
    VERY_HARD: 1.35 // Changed from 1.3
}
```

### Modifying Enemy Stats

**Location**: `js/utils/Constants.js`

**Template Structure** (`ENEMY_LEVEL_TEMPLATES`):
```javascript
1: {
    baseHp: 100,
    baseSpeed: 0.3,
    baseSize: 20,
    shape: 'circle'
}
```

**To Change**: Modify values in template, affects all enemies of that level.

### Adding New Stat Tracking

1. **Add to GameState** (`js/core/GameState.js`):
```javascript
this.stats = {
    // ... existing stats
    newStat: 0
};
```

2. **Reset in reset()**:
```javascript
this.stats = {
    // ... existing stats
    newStat: 0
};
```

3. **Add Recording Method**:
```javascript
recordNewStat(value) {
    this.stats.newStat += value;
}
```

4. **Call When Needed**:
```javascript
gameState.recordNewStat(value);
```

### Changing UI Elements

**Location**: `js/managers/UIManager.js`

**Key Methods**:
- `updateStats()`: Updates all UI stat displays
- `drawEnemy()`: Renders enemies
- `drawBuilding()`: Renders buildings
- `showDeathPopup()`: Shows game over screen

**Example: Add New UI Element**:
1. Add HTML element in `index.html`
2. Update in `updateStats()`:
```javascript
document.getElementById('new-ui').textContent = gameState.newValue;
```

### Modifying Money Rewards

**Location**: `js/entities/Enemy.js`

**Method**: `getMoneyReward()`

**Current Formula**:
```javascript
return (this.level * 10) + (this.maxHp * 0.1) * (1 + 0.2 * gameState.utilityLevel);
```

**To Change**: Modify the return statement.

### Modifying Lives Cost

**Location**: `js/utils/Constants.js`

**Structure**: `LIVES_COST_BY_LEVEL`

```javascript
export const LIVES_COST_BY_LEVEL = {
    1: 1,
    2: 3,
    3: 10,
    4: 25,
    5: 100
};
```

**To Change**: Modify values in object.

## Common Pitfalls

1. **Circular Dependencies**: 
   - Don't import from files that import from you
   - Move shared constants to `Constants.js`

2. **Game State Reset**:
   - Always update `GameState.reset()` when adding new state
   - Always update `startNewGame()` when adding new initialization

3. **Wave Manager**:
   - Created per game in `startNewGame()`
   - Stored in `window.waveManager` for global access
   - Don't create multiple instances

4. **ES6 Modules**:
   - Always use `.js` extension in imports
   - No `require()`, only `import`/`export`

5. **Enemy Spawning**:
   - Use `spawnEnemyForWave()` for wave system
   - Use `spawnEnemy(round)` only for legacy/fallback

6. **Modifier Application**:
   - Modifiers applied in `Enemy.applyModifiers()`
   - Special behaviors need custom logic in enemy death handlers

## Testing Checklist

After making changes:

- [ ] Game starts correctly
- [ ] Enemies spawn in waves
- [ ] Towers attack enemies
- [ ] Damage calculations work
- [ ] Money rewards on kill
- [ ] Lives lost on escape
- [ ] Game over triggers correctly
- [ ] High scores save
- [ ] Menu works
- [ ] Fast forward works
- [ ] Difficulty selection works
- [ ] All stats reset on new game

## Version Updates

When updating version:

1. Update `<title>` in `index.html`
2. Update patch notes `<h4>Patch Notes (vX.X.X)</h4>`
3. Update version in any other locations
4. Commit with descriptive message

