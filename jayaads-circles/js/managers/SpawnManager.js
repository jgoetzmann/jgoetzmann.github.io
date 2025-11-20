import { Enemy } from '../entities/Enemy.js';
import { Building } from '../entities/Building.js';
import { ENEMY_TYPES, ENEMY_PROPERTIES, BUILDING_TYPES, GAME_CONFIG } from '../utils/Constants.js';
import { PositionHelper, CollisionHelper } from '../utils/Helpers.js';

export class SpawnManager {
    constructor() {
        this.enemies = [];
        this.buildings = [];
    }

    // Enemy spawning
    chooseEnemyType(round) {
        const randomChoice = Math.ceil(Math.random() * 100);
        for (let i = Object.keys(ENEMY_TYPES).length - 1; i > 0; i--) {
            if (randomChoice < (round / 100) - (i * 30) + 60) {
                return i;
            }
        }
        return 0; // nil
    }

    determineEnemyProperty(round) {
        const randomChoice = Math.ceil(Math.random() * 100);
        if (randomChoice < ((round - 12000) / 1000) && randomChoice <= 50) {
            return ENEMY_PROPERTIES.BLUE;
        } else if (randomChoice > ((112000 - round) / 1000) && randomChoice > 50) {
            return ENEMY_PROPERTIES.RED;
        }
        return ENEMY_PROPERTIES.NONE;
    }

    spawnEnemy(round) {
        const enemyTypeId = this.chooseEnemyType(round);
        if (enemyTypeId === 0) return null; // nil

        const positionY = PositionHelper.getEnemySpawnY(enemyTypeId);
        const property = this.determineEnemyProperty(round);
        
        const enemy = new Enemy(enemyTypeId, null, positionY, property);
        
        // Boss scaling
        if (enemyTypeId === 11) {
            enemy.scaleHp(500);
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

