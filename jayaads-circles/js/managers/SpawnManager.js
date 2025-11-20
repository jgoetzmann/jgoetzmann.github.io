import { Enemy } from '../entities/Enemy.js';
import { Building } from '../entities/Building.js';
import { BUILDING_TYPES, GAME_CONFIG } from '../utils/Constants.js';
import { PositionHelper, CollisionHelper } from '../utils/Helpers.js';
import { ModifierManager } from '../utils/ModifierSystem.js';
import { EnemyThreatCalculator } from '../utils/EnemyThreatCalculator.js';

export class SpawnManager {
    constructor() {
        this.enemies = [];
        this.buildings = [];
    }

    // Determine enemy level based on round
    chooseEnemyLevel(round) {
        const roundNumber = Math.floor(round / GAME_CONFIG.ROUND_DURATION);
        // Level scales with round: early rounds = level 1-2, later = higher (up to 10)
        if (roundNumber < 5) return 1;
        if (roundNumber < 10) return Math.random() < 0.7 ? 1 : 2;
        if (roundNumber < 20) return Math.random() < 0.5 ? 2 : 3;
        if (roundNumber < 30) return Math.random() < 0.5 ? 3 : 4;
        if (roundNumber < 50) return Math.random() < 0.5 ? 4 : 5;
        if (roundNumber < 70) return Math.random() < 0.5 ? 5 : 6;
        if (roundNumber < 100) return Math.random() < 0.5 ? 6 : 7;
        if (roundNumber < 150) return Math.random() < 0.5 ? 7 : 8;
        if (roundNumber < 200) return Math.random() < 0.5 ? 8 : 9;
        return Math.min(10, Math.floor(roundNumber / 30) + 1);
    }

    // Get max modifiers based on round progression
    getMaxModifiers(round) {
        const roundNumber = Math.floor(round / GAME_CONFIG.ROUND_DURATION);
        // Start with 0 modifiers, increase as rounds progress
        if (roundNumber < 5) return 0;
        if (roundNumber < 10) return 1;
        if (roundNumber < 20) return 2;
        return 3; // Max 3 modifiers
    }

    spawnEnemy(round) {
        // Legacy method for backward compatibility
        // Choose enemy level
        const level = this.chooseEnemyLevel(round);
        
        // Determine position
        const positionY = PositionHelper.positionOffset(75);
        
        // Select modifiers based on round progression
        const maxModifiers = this.getMaxModifiers(round);
        let modifiers = [];
        
        if (maxModifiers > 0) {
            // Threat budget increases with round
            const roundNumber = Math.floor(round / GAME_CONFIG.ROUND_DURATION);
            const threatBudget = 2.0 + (roundNumber * 0.5); // More threat available as rounds progress
            modifiers = ModifierManager.selectModifiers(threatBudget, maxModifiers);
        }
        
        // Create enemy with level and modifiers
        const enemy = new Enemy(level, null, positionY, modifiers);

        this.enemies.push(enemy);
        return enemy;
    }

    spawnEnemyForWave(level, modifiers = [], isFortified = false) {
        // New method for wave-based spawning
        // Determine position
        const positionY = PositionHelper.positionOffset(75);
        
        // Create enemy with level and modifiers
        const enemy = new Enemy(level, null, positionY, modifiers);
        
        // Set fortified status if needed
        if (isFortified) {
            enemy.isFortified = true;
            enemy.shape = 'hexagon';
        }

        this.enemies.push(enemy);
        return enemy;
    }

    // Building placement
    canPlaceBuilding(newX, newY, newSize, existingBuildings) {
        for (const building of existingBuildings) {
            const a = newSize + building.size;
            const x = newX - building.positionX;
            const y = newY - building.positionY;
            if (a > Math.sqrt((x * x) + (y * y))) {
                return false;
            }
        }
        return true;
    }

    findBuildingPlacement(range, size, buildingType, existingBuildings) {
        if (size > 200) size = 200;
        
        for (let j = 0; j < 100; j++) {
            let positionX, positionY;
            
            if (buildingType === 6) { // moving cannon factory
                positionX = Math.ceil(Math.random() * 160) + 800;
                positionY = Math.ceil(Math.random() * (80 + (range - 10) * 2));
            } else {
                positionX = Math.ceil(Math.random() * GAME_CONFIG.CANVAS_WIDTH);
                positionY = Math.ceil(Math.random() * (80 + (range - 10) * 2));
            }

            // Bank placement restrictions
            if (buildingType === 19 && 
                ((positionY > 150 && positionY < 280) || (positionY < 330 && positionY > 200))) {
                continue;
            }

            positionY += (210 - range);

            if (positionY < GAME_CONFIG.CANVAS_HEIGHT && positionY > 0 &&
                this.canPlaceBuilding(positionX, positionY, size, existingBuildings) &&
                (positionY < (GAME_CONFIG.TRACK_Y_START - size) || positionY > (GAME_CONFIG.TRACK_Y_END + size))) {
                return { x: positionX, y: positionY };
            }
        }
        return null;
    }

    spawnBuilding(typeId, positionX, positionY) {
        const building = new Building(typeId, positionX, positionY);
        this.buildings.push(building);
        return building;
    }

    spawnCar(factoryX, factoryY) {
        const pushX = Math.ceil(Math.random() * 60) + 900;
        const pushY = Math.ceil(Math.random() * 70) + 205;
        return this.spawnBuilding(17, pushX, pushY);
    }

    spawnPellet(cannonX, cannonY, side) {
        const pushX = (Math.random() * 5) - 2 + cannonX;
        const pushY = cannonY;
        const pellet = new Building(18, pushX, pushY);
        pellet.side = side; // 0 = top, 1 = bottom
        pellet.skew = (Math.random() * 2) - 1;
        this.buildings.push(pellet);
        return pellet;
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    removeBuilding(building) {
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            this.buildings.splice(index, 1);
        }
    }

    getEnemies() {
        return this.enemies;
    }

    getBuildings() {
        return this.buildings;
    }
}

