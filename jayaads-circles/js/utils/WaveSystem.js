import { EnemyThreatCalculator } from './EnemyThreatCalculator.js';
import { ModifierManager } from './ModifierSystem.js';

// Wave System Constants
export const WAVE_CONFIG = {
    WAVE_DELAY: 30000, // 30 seconds between waves
    PART_DELAY: 5000,  // 5 seconds between parts
    INITIAL_THREAT: 100,
    DIFFICULTY_ADDITIONS: {
        NORMAL: 60,
        HARD: 80,
        VERY_HARD: 100
    },
    DIFFICULTY_MULTIPLIERS: {
        NORMAL: 1.05,
        HARD: 1.10,
        VERY_HARD: 1.15
    }
};

// Part Types (priority order)
export const PART_TYPES = {
    NORMAL: 'normal',
    SWARM: 'swarm',
    DUPLICATE: 'duplicate',
    BOSS: 'boss'
};

// Part Type Configurations
export const PART_CONFIGS = {
    [PART_TYPES.NORMAL]: {
        enemyCount: {min: 3, max: 5},
        hasSpecialEffects: false
    },
    [PART_TYPES.SWARM]: {
        enemyCount: {min: 8, max: 20},
        hasSpecialEffects: false
    },
    [PART_TYPES.DUPLICATE]: {
        enemyCount: {min: 3, max: 8},
        hasSpecialEffects: true, // All share identical modifiers
        sharedModifiers: true
    },
    [PART_TYPES.BOSS]: {
        enemyCount: {min: 1, max: 1},
        hasSpecialEffects: true
    }
};

export class WaveManager {
    constructor(difficulty = 'NORMAL') {
        this.difficulty = difficulty.toUpperCase(); // Ensure uppercase for lookup
        this.currentWave = 0;
        this.currentPart = 0;
        this.waveStartTime = null;
        this.partStartTime = null;
        this.isWaitingForWave = false;
        this.isWaitingForPart = false;
        this.waveThreat = WAVE_CONFIG.INITIAL_THREAT;
    }

    /**
     * Calculate threat for a wave
     * Formula: Each wave = (previous wave + addition) * multiplier
     */
    getWaveThreat(waveNumber) {
        if (waveNumber === 1) {
            return WAVE_CONFIG.INITIAL_THREAT;
        }
        
        const addition = WAVE_CONFIG.DIFFICULTY_ADDITIONS[this.difficulty] || WAVE_CONFIG.DIFFICULTY_ADDITIONS.NORMAL;
        const multiplier = WAVE_CONFIG.DIFFICULTY_MULTIPLIERS[this.difficulty] || WAVE_CONFIG.DIFFICULTY_MULTIPLIERS.NORMAL;
        
        // Recursive calculation: (previous wave + addition) * multiplier
        let threat = WAVE_CONFIG.INITIAL_THREAT;
        for (let i = 2; i <= waveNumber; i++) {
            threat = (threat + addition) * multiplier;
        }
        
        return Math.ceil(threat);
    }

    /**
     * Check if it's time to start a new wave
     * currentTime should be game time (accounts for speed multiplier)
     */
    shouldStartWave(currentTime) {
        if (this.isWaitingForWave) {
            if (currentTime - this.waveStartTime >= WAVE_CONFIG.WAVE_DELAY) {
                this.isWaitingForWave = false;
                this.currentWave++;
                this.currentPart = 0;
                this.partStartTime = null; // Reset for new wave
                // CRITICAL: Recalculate threat for new wave
                this.waveThreat = this.getWaveThreat(this.currentWave);
                return true;
            }
        } else if (!this.waveStartTime) {
            // First wave - start immediately (no delay)
            this.waveStartTime = currentTime;
            this.currentWave = 1;
            this.currentPart = 0;
            this.partStartTime = null; // Ensure first part can spawn
            this.waveThreat = this.getWaveThreat(1);
            return true;
        }
        return false;
    }

    /**
     * Check if it's time to spawn the next part
     * currentTime should be game time (accounts for speed multiplier)
     */
    shouldSpawnPart(currentTime) {
        // If we're waiting for a part delay, check if delay has passed
        if (this.isWaitingForPart) {
            if (currentTime - this.partStartTime >= WAVE_CONFIG.PART_DELAY) {
                this.isWaitingForPart = false;
                this.currentPart++;
                // Don't set partStartTime here - let startPartDelay handle it
                return true;
            }
            return false;
        }
        
        // If partStartTime is null, this is the first part of the wave
        // Only spawn if we have an active wave and not waiting for wave
        if (this.partStartTime === null && this.currentWave > 0 && !this.isWaitingForWave) {
            // Set partStartTime to current time for first part
            this.partStartTime = currentTime;
            if (this.currentPart === 0) {
                this.currentPart = 1;
            }
            return true;
        }
        
        return false;
    }

    /**
     * Mark that we're waiting for the next wave
     */
    startWaveDelay(currentTime) {
        this.isWaitingForWave = true;
        this.waveStartTime = currentTime;
        this.partStartTime = null;
    }

    /**
     * Mark that we're waiting for the next part
     */
    startPartDelay(currentTime) {
        this.isWaitingForPart = true;
        this.partStartTime = currentTime;
    }

    /**
     * Get max parts for current wave based on wave number
     */
    getMaxPartsForWave() {
        if (this.currentWave <= 10) return 1;
        if (this.currentWave <= 20) return 2;
        if (this.currentWave <= 30) return 3;
        if (this.currentWave <= 40) return 4;
        if (this.currentWave <= 50) return 5;
        return 5; // Wave 51+
    }

    /**
     * Get max level for current wave
     */
    getMaxLevelForWave() {
        if (this.currentWave <= 10) return 1;
        if (this.currentWave <= 20) return 2;
        if (this.currentWave <= 30) return 3;
        if (this.currentWave <= 40) return 4;
        if (this.currentWave <= 50) return 5;
        return 10; // Wave 51+ can have any level
    }

    /**
     * Get max modifiers for current wave
     */
    getMaxModifiersForWave() {
        if (this.currentWave <= 30) return 1;
        if (this.currentWave <= 50) return 2;
        return 3; // Wave 51+
    }

    /**
     * Get current part type based on wave composition
     */
    getPartType(partNumber) {
        const maxParts = this.getMaxPartsForWave();
        
        if (partNumber > maxParts) {
            return null; // Wave complete
        }

        // Determine part type based on priority and remaining threat
        // Simplified: alternate between types for now
        const partTypes = [PART_TYPES.NORMAL, PART_TYPES.SWARM, PART_TYPES.DUPLICATE];
        return partTypes[(partNumber - 1) % partTypes.length];
    }

    /**
     * Check if wave is complete
     * Wave is complete when we've spawned all parts (currentPart > maxParts)
     */
    isWaveComplete() {
        const maxParts = this.getMaxPartsForWave();
        // Wave is complete if current part exceeds max parts
        // Note: currentPart is incremented AFTER spawning, so if we just spawned part 1 of 1, currentPart = 2, which is > 1
        return this.currentPart > maxParts;
    }
    
    /**
     * Check if there are more parts in this wave to spawn
     * This checks BEFORE incrementing currentPart
     */
    hasMoreParts() {
        const maxParts = this.getMaxPartsForWave();
        // If currentPart is less than maxParts, we have more parts to spawn
        // After spawning part 1 of 2, currentPart becomes 2, so 2 < 2 is false (no more parts)
        return this.currentPart < maxParts;
    }

    /**
     * Generate enemy spawns for the current part
     * Returns array of {level, modifiers, isFortified} objects
     */
    spawnEnemiesForPart() {
        const partType = this.getPartType(this.currentPart);
        if (!partType) return [];

        const config = PART_CONFIGS[partType];
        const enemyCount = Math.floor(Math.random() * (config.enemyCount.max - config.enemyCount.min + 1)) + config.enemyCount.min;
        
        const spawns = [];
        // Use full wave threat for each part (parts can overlap in threat usage)
        // This ensures early waves can actually spawn enemies
        let remainingThreat = this.waveThreat;
        
        // Get max modifiers based on wave rules
        const maxModifiers = this.getMaxModifiersForWave();
        const maxLevel = this.getMaxLevelForWave();
        
        // For duplicate parts, all enemies share the same modifiers
        let sharedModifiers = null;
        if (partType === PART_TYPES.DUPLICATE && config.sharedModifiers) {
            // Select shared modifiers once
            const threatBudget = remainingThreat / enemyCount;
            sharedModifiers = ModifierManager.selectModifiers(threatBudget, maxModifiers);
        }

        for (let i = 0; i < enemyCount && remainingThreat >= 50; i++) {
            // Choose level (prefer lower levels first to fit more enemies, but respect max level)
            const level = Math.min(this.chooseEnemyLevel(remainingThreat), maxLevel);
            
            // Select modifiers
            let modifiers = [];
            if (partType === PART_TYPES.DUPLICATE && sharedModifiers) {
                modifiers = sharedModifiers;
            } else {
                const threatBudget = remainingThreat / (enemyCount - i);
                modifiers = ModifierManager.selectModifiers(threatBudget, maxModifiers);
            }
            
            // Calculate threat cost
            const threatCost = EnemyThreatCalculator.calculateThreatCost(level, modifiers);
            
            if (threatCost <= remainingThreat) {
                const isFortified = modifiers.some(m => m.id === 'fortified');
                spawns.push({ level, modifiers, isFortified });
                remainingThreat -= threatCost;
            } else {
                // Can't afford this enemy, try lower level
                break;
            }
        }

        return spawns;
    }

    /**
     * Choose enemy level based on available threat
     */
    chooseEnemyLevel(availableThreat) {
        // Prefer lower levels to spawn more enemies
        if (availableThreat >= 250000) return 10;
        if (availableThreat >= 100000) return 9;
        if (availableThreat >= 40000) return 8;
        if (availableThreat >= 15000) return 7;
        if (availableThreat >= 6000) return 6;
        if (availableThreat >= 2500) return 5;
        if (availableThreat >= 1000) return 4;
        if (availableThreat >= 400) return 3;
        if (availableThreat >= 150) return 2;
        return 1;
    }
}

