// Calculate threat cost for enemies
// Higher threat costs = fewer enemies can spawn per wave

export class EnemyThreatCalculator {
    /**
     * Calculate threat cost for an enemy
     * @param {number} level - Enemy level (1-5)
     * @param {Array} modifiers - Array of modifier objects
     * @returns {number} Threat cost
     */
    static calculateThreatCost(level, modifiers = []) {
        // Base threat cost increases significantly with level
        // Level 1 = 50, Level 2 = 150, Level 3 = 400, etc.
        let baseThreat = 0;
        switch(level) {
            case 1: baseThreat = 50; break;
            case 2: baseThreat = 150; break;
            case 3: baseThreat = 400; break;
            case 4: baseThreat = 1000; break;
            case 5: baseThreat = 2500; break;
            case 6: baseThreat = 6000; break;
            case 7: baseThreat = 15000; break;
            case 8: baseThreat = 40000; break;
            case 9: baseThreat = 100000; break;
            case 10: baseThreat = 250000; break;
            default: baseThreat = level * 50;
        }
        
        // Apply modifier multipliers (multiplicative)
        let totalThreat = baseThreat;
        for (const modifier of modifiers) {
            totalThreat *= modifier.threatMultiplier;
        }
        
        return Math.ceil(totalThreat);
    }
    
    /**
     * Calculate how many enemies of a given type can spawn with available threat
     * @param {number} availableThreat - Available threat budget
     * @param {number} level - Enemy level
     * @param {Array} modifiers - Modifiers
     * @returns {number} Maximum count
     */
    static getMaxSpawnCount(availableThreat, level, modifiers = []) {
        const costPerEnemy = this.calculateThreatCost(level, modifiers);
        return Math.floor(availableThreat / costPerEnemy);
    }
}

