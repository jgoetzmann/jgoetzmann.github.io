import { DAMAGE_TYPES } from '../utils/Constants.js';
import { ModifierManager } from '../utils/ModifierSystem.js';

// Enemy Level Templates
// Levels 1-5: Made smaller, levels 6-10: New higher tiers
export const ENEMY_LEVEL_TEMPLATES = {
    1: { baseHp: 50, baseSize: 8, baseSpeed: 0.5 },
    2: { baseHp: 150, baseSize: 12, baseSpeed: 0.4 },
    3: { baseHp: 400, baseSize: 16, baseSpeed: 0.3 },
    4: { baseHp: 1000, baseSize: 20, baseSpeed: 0.25 },
    5: { baseHp: 2500, baseSize: 24, baseSpeed: 0.2 },
    6: { baseHp: 6000, baseSize: 28, baseSpeed: 0.18 },
    7: { baseHp: 15000, baseSize: 32, baseSpeed: 0.15 },
    8: { baseHp: 40000, baseSize: 36, baseSpeed: 0.12 },
    9: { baseHp: 100000, baseSize: 40, baseSpeed: 0.1 },
    10: { baseHp: 250000, baseSize: 45, baseSpeed: 0.08 }
};

export class Enemy {
    constructor(level, positionX = null, positionY = null, modifiers = []) {
        const template = ENEMY_LEVEL_TEMPLATES[level];
        if (!template) {
            throw new Error(`Invalid enemy level: ${level}`);
        }

        this.level = level;
        this.name = `Level ${level} Square`;
        this.baseHp = template.baseHp;
        this.hp = template.baseHp;
        this.maxHp = template.baseHp;
        this.baseSize = template.baseSize;
        this.size = template.baseSize;
        this.baseSpeed = template.baseSpeed;
        this.speed = template.baseSpeed;
        
        this.positionX = positionX !== null ? positionX : -50;
        this.positionY = positionY !== null ? positionY : 200;
        
        this.dead = false;
        this.shape = 'square'; // 'square' or 'hexagon' (fortified)
        this.isFortified = false;
        
        // Resistance system
        this.resistances = {
            [DAMAGE_TYPES.PHYSICAL]: 0,
            [DAMAGE_TYPES.EXPLOSIVE]: 0,
            [DAMAGE_TYPES.POISON]: 0,
            [DAMAGE_TYPES.MAGIC]: 0,
            [DAMAGE_TYPES.TRUE]: 0,
            [DAMAGE_TYPES.ELECTRICAL]: 0
        };
        
        // Defense stats
        this.critBlock = 0;
        this.ccResist = 0; // CC resistance
        this.dotResist = 0; // DoT resistance
        this.durabilityBuff = 1.0; // Multiplicative health modifier
        
        // Modifiers
        this.modifiers = [];
        this.specialBehavior = null;
        this.specialBehaviorData = null;
        
        // Apply modifiers
        if (modifiers.length > 0) {
            ModifierManager.applyModifiers(this, modifiers);
        }
        
        // Apply durability buff to HP
        if (this.durabilityBuff !== 1.0) {
            this.hp *= this.durabilityBuff;
            this.maxHp *= this.durabilityBuff;
            this.baseHp *= this.durabilityBuff;
        }
    }

    updatePosition() {
        // Handle special behaviors
        if (this.specialBehavior === 'dash_to_midpoint' && !this.hasDashed) {
            const midpoint = 480; // Canvas width / 2
            if (this.positionX < midpoint) {
                this.positionX = midpoint;
                this.hasDashed = true;
            }
        }
        
        this.positionX += this.speed;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.dead = true;
        }
    }

    isOffScreen(canvasWidth = 965) {
        return this.positionX > canvasWidth;
    }

    getLivesCost() {
        // Base cost based on level
        return this.level * 10;
    }

    getCenterX() {
        return this.positionX + (this.size / 2);
    }

    getCenterY() {
        return this.positionY + (this.size / 2);
    }

    getRadius() {
        return this.size / 2;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    resetSpeed() {
        this.speed = this.baseSpeed;
    }

    // Handle special behaviors on death
    onDeath() {
        if (this.specialBehavior === 'spawn_copies_on_death') {
            return {
                type: 'spawn_copies',
                count: this.specialBehaviorData?.spawnCount || 4,
                level: this.level
            };
        } else if (this.specialBehavior === 'transform_on_death') {
            return {
                type: 'transform',
                level: this.level
            };
        }
        return null;
    }
}
