// Modifier Rarities
export const MODIFIER_RARITY = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

// Modifier Colors by Rarity
export const MODIFIER_COLORS = {
    'common': '#ffffff',      // White
    'uncommon': '#4caf50',    // Green
    'rare': '#2196f3',        // Blue
    'epic': '#9c27b0',        // Purple
    'legendary': '#ff9800'    // Orange
};

// Modifier Definitions
export const MODIFIERS = {
    // Common
    MINOR_SPEED_BOOST: {
        id: 'minor_speed_boost',
        name: 'Minor Speed Boost',
        rarity: MODIFIER_RARITY.COMMON,
        threatMultiplier: 1.1,
        color: '#ffffff', // White
        effects: {
            speed: 1.15
        }
    },
    MINOR_SIZE_REDUCTION: {
        id: 'minor_size_reduction',
        name: 'Minor Size Reduction',
        rarity: MODIFIER_RARITY.COMMON,
        threatMultiplier: 0.9,
        color: '#ffffff', // White
        effects: {
            size: 0.85
        }
    },
    
    // Uncommon
    ELEMENTAL_RESISTANCE: {
        id: 'elemental_resistance',
        name: 'Elemental Resistance',
        rarity: MODIFIER_RARITY.UNCOMMON,
        threatMultiplier: 1.3,
        color: '#4caf50', // Green
        effects: {
            resistances: {magic: 25, electrical: 25}
        }
    },
    MODERATE_CRIT_BLOCK: {
        id: 'moderate_crit_block',
        name: 'Moderate Crit Block',
        rarity: MODIFIER_RARITY.UNCOMMON,
        threatMultiplier: 1.2,
        color: '#4caf50', // Green
        effects: {
            critBlock: 15
        }
    },
    DOT_RESISTANCE: {
        id: 'dot_resistance',
        name: 'DoT Resistance',
        rarity: MODIFIER_RARITY.UNCOMMON,
        threatMultiplier: 1.25,
        color: '#4caf50', // Green
        effects: {
            dotResist: 30
        }
    },
    
    // Rare
    MAJOR_DURABILITY: {
        id: 'major_durability',
        name: 'Major Durability',
        rarity: MODIFIER_RARITY.RARE,
        threatMultiplier: 1.5,
        color: '#2196f3', // Blue
        effects: {
            durabilityBuff: 1.5
        }
    },
    FORTIFIED: {
        id: 'fortified',
        name: 'Fortified',
        rarity: MODIFIER_RARITY.RARE,
        threatMultiplier: 1.4,
        color: '#2196f3', // Blue
        effects: {
            isFortified: true,
            shape: 'hexagon'
        }
    },
    
    // Epic
    SPEEDSTER: {
        id: 'speedster',
        name: 'Speedster',
        rarity: MODIFIER_RARITY.EPIC,
        threatMultiplier: 1.8,
        color: '#9c27b0', // Purple
        effects: {
            speed: 1.5,
            specialBehavior: 'dash_to_midpoint'
        },
        icon: '→'
    },
    RING_LEADER: {
        id: 'ring_leader',
        name: 'Ring Leader',
        rarity: MODIFIER_RARITY.EPIC,
        threatMultiplier: 2.0,
        color: '#9c27b0', // Purple
        effects: {
            specialBehavior: 'spawn_copies_on_death',
            spawnCount: 4
        },
        icon: '[]'
    },
    RANDOMIZER: {
        id: 'randomizer',
        name: 'Randomizer',
        rarity: MODIFIER_RARITY.EPIC,
        threatMultiplier: 1.9,
        color: '#9c27b0', // Purple
        effects: {
            specialBehavior: 'transform_on_death'
        },
        icon: '?'
    }
};

export class ModifierManager {
    /**
     * Get modifiers by rarity
     */
    static getModifiersByRarity(rarity) {
        return Object.values(MODIFIERS).filter(m => m.rarity === rarity);
    }

    /**
     * Select random modifiers based on threat budget
     */
    static selectModifiers(threatBudget, maxModifiers = 3) {
        const selected = [];
        let remainingThreat = threatBudget;
        
        // Priority: Common -> Uncommon -> Rare -> Epic
        const rarities = [
            MODIFIER_RARITY.COMMON,
            MODIFIER_RARITY.UNCOMMON,
            MODIFIER_RARITY.RARE,
            MODIFIER_RARITY.EPIC
        ];

        for (let i = 0; i < maxModifiers; i++) {
            for (const rarity of rarities) {
                const available = this.getModifiersByRarity(rarity)
                    .filter(m => !selected.includes(m.id) && 
                           m.threatMultiplier <= remainingThreat);
                
                if (available.length > 0) {
                    const modifier = available[Math.floor(Math.random() * available.length)];
                    selected.push(modifier.id);
                    remainingThreat /= modifier.threatMultiplier;
                    break;
                }
            }
        }

        return selected.map(id => MODIFIERS[id]).filter(Boolean);
    }

    /**
     * Apply modifiers to enemy stats
     */
    static applyModifiers(enemy, modifiers) {
        for (const modifier of modifiers) {
            if (modifier.effects) {
                // Apply stat changes
                if (modifier.effects.speed) {
                    enemy.baseSpeed *= modifier.effects.speed;
                    enemy.speed *= modifier.effects.speed;
                }
                if (modifier.effects.size) {
                    enemy.size *= modifier.effects.size;
                }
                if (modifier.effects.resistances) {
                    Object.assign(enemy.resistances, modifier.effects.resistances);
                }
                if (modifier.effects.critBlock !== undefined) {
                    enemy.critBlock += modifier.effects.critBlock;
                }
                if (modifier.effects.dotResist !== undefined) {
                    enemy.dotResist += modifier.effects.dotResist;
                }
                if (modifier.effects.durabilityBuff) {
                    enemy.durabilityBuff *= modifier.effects.durabilityBuff;
                }
                if (modifier.effects.isFortified) {
                    enemy.isFortified = true;
                    enemy.shape = 'hexagon';
                }
                if (modifier.effects.specialBehavior) {
                    enemy.specialBehavior = modifier.effects.specialBehavior;
                    enemy.specialBehaviorData = modifier.effects;
                }
            }
            enemy.modifiers.push(modifier);
        }
    }
}

