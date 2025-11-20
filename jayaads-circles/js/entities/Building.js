import { BUILDING_TYPES, BUILDING_COLORS, DAMAGE_TYPES, TOWER_CATEGORIES } from '../utils/Constants.js';

export class Building {
    constructor(typeId, positionX, positionY, level = 1) {
        const type = Object.values(BUILDING_TYPES).find(t => t.id === typeId);
        if (!type) {
            throw new Error(`Invalid building type ID: ${typeId}`);
        }

        this.name = type.name;
        this.typeId = typeId;
        this.property = type.property;
        this.positionX = positionX;
        this.positionY = positionY;
        this.size = type.size;
        this.range = type.range;
        this.attackSpeed = type.attackSpeed; // Attack speed stat
        this.damage = type.damage; // Base damage
        this.targets = type.targets;
        this.level = level;
        this.buffs = 0;
        this.lastAttackFrame = 0;
        
        // New stats system
        this.category = type.category || TOWER_CATEGORIES.DAMAGE;
        this.damageFamily = type.damageFamily || DAMAGE_TYPES.PHYSICAL;
        this.damageTypes = type.damageTypes || {[type.damageFamily || DAMAGE_TYPES.PHYSICAL]: 1.0};
        
        // Penetration (default 0)
        this.penetration = type.penetration || {};
        // Format: {[damageType]: {percent: 0, flat: 0}}
        
        // Crit stats (default 0/100)
        this.critChance = type.critChance || 0;
        this.critDamage = type.critDamage || 100;
        
        // Fortified scaler (default 1.0)
        this.fortifiedScaler = type.fortifiedScaler || 1.0;
        
        // CC Resist
        this.ccResist = type.ccResist || 0;
        
        // Damage buff (stacks linearly)
        this.damageBuff = 1.0;
    }

    canAttack(currentRound) {
        return Number.isInteger(currentRound / this.attackSpeed);
    }

    upgradeDamage(amount) {
        this.damage += amount;
    }

    upgradeRange(amount) {
        this.range += amount;
    }

    upgradeAttackSpeed(amount) {
        this.attackSpeed = Math.max(5, this.attackSpeed + amount);
    }

    upgradeTargets(amount) {
        this.targets += amount;
    }
    
    addDamageBuff(multiplier) {
        // Stacks linearly: 1.0 + 0.2 + 0.3 = 1.5
        this.damageBuff += (multiplier - 1.0);
    }

    getColor() {
        return BUILDING_COLORS[this.typeId] || "#232323";
    }

    // Special building types
    isMovingCannon() {
        return this.typeId === 6.1 || this.typeId === 17;
    }

    isPellet() {
        return this.typeId === 8.1 || this.typeId === 18;
    }

    isBank() {
        return this.typeId === 19;
    }

    isCannonFactory() {
        return this.typeId === 6;
    }

    isScatterCannon() {
        return this.typeId === 8;
    }
}
