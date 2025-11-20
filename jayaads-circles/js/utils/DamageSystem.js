// Import from Constants to avoid duplication
import { DAMAGE_TYPES, TOWER_CATEGORIES } from './Constants.js';

// Re-export for convenience
export { DAMAGE_TYPES, TOWER_CATEGORIES };

// Damage calculation system
export class DamageCalculator {
    /**
     * Calculate damage multiplier based on resistance
     * @param {number} resistance - Enemy resistance value
     * @returns {number} Damage multiplier
     */
    static getDamageMultiplier(resistance) {
        if (resistance >= 0) {
            return 100 / (100 + resistance);
        } else {
            return 2 - (100 / (100 - resistance));
        }
    }

    /**
     * Calculate final resistance after penetration
     * @param {number} baseResistance - Base resistance value
     * @param {number} percentPen - Percent penetration (0-1)
     * @param {number} flatPen - Flat penetration
     * @returns {number} Final resistance
     */
    static applyPenetration(baseResistance, percentPen = 0, flatPen = 0) {
        const percentPenProduct = 1 - percentPen; // Convert to multiplier
        return baseResistance * percentPenProduct - flatPen;
    }

    /**
     * Calculate final damage with all modifiers
     * @param {Object} params
     * @param {number} params.baseDamage - Base damage value
     * @param {Object} params.damageTypes - Damage types and amounts {type: amount}
     * @param {Object} params.enemyResistances - Enemy resistances {type: value}
     * @param {Object} params.towerPenetration - Tower penetration {type: {percent: 0, flat: 0}}
     * @param {number} params.critChance - Crit chance (0-100)
     * @param {number} params.critDamage - Crit damage multiplier
     * @param {number} params.enemyCritBlock - Enemy crit block value
     * @param {number} params.damageBuff - Damage buff multiplier (1.0 = no buff)
     * @param {number} params.fortifiedScaler - Damage scaler vs fortified (1.0 = normal)
     * @param {boolean} params.isFortified - Is enemy fortified
     * @returns {Object} {totalDamage, isCrit, damageBreakdown}
     */
    static calculateDamage({
        baseDamage,
        damageTypes,
        enemyResistances = {},
        towerPenetration = {},
        critChance = 0,
        critDamage = 100,
        enemyCritBlock = 0,
        damageBuff = 1.0,
        fortifiedScaler = 1.0,
        isFortified = false
    }) {
        let totalDamage = 0;
        const damageBreakdown = {};

        // Apply fortified scaler if applicable
        const fortifiedMultiplier = isFortified ? fortifiedScaler : 1.0;

        // Calculate damage for each type
        for (const [type, amount] of Object.entries(damageTypes)) {
            const baseTypeDamage = amount * baseDamage;
            
            // Get enemy resistance for this type
            const baseResistance = enemyResistances[type] || 0;
            
            // Apply penetration
            const pen = towerPenetration[type] || {percent: 0, flat: 0};
            const finalResistance = this.applyPenetration(
                baseResistance,
                pen.percent,
                pen.flat
            );
            
            // Calculate damage multiplier
            const damageMultiplier = this.getDamageMultiplier(finalResistance);
            
            // Apply damage
            const typeDamage = baseTypeDamage * damageMultiplier * damageBuff * fortifiedMultiplier;
            totalDamage += typeDamage;
            damageBreakdown[type] = typeDamage;
        }

        // Handle crit
        let isCrit = false;
        const effectiveCritChance = Math.max(0, critChance - enemyCritBlock);
        const effectiveCritDamage = Math.max(0, critDamage - (enemyCritBlock * 2));
        
        if (effectiveCritChance > 0 && Math.random() * 100 < effectiveCritChance) {
            isCrit = true;
            totalDamage *= (1 + effectiveCritDamage / 100);
        }

        return {
            totalDamage: Math.max(0, totalDamage),
            isCrit,
            damageBreakdown
        };
    }
}

