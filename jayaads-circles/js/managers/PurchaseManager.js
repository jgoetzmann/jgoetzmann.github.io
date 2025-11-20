import { PURCHASE_COSTS, COST_INCREMENTS, BUILDING_TYPES } from '../utils/Constants.js';

export class PurchaseManager {
    constructor(gameState, spawnManager, upgradeManager) {
        this.gameState = gameState;
        this.spawnManager = spawnManager;
        this.upgradeManager = upgradeManager;
        this.costs = { ...PURCHASE_COSTS };
    }

    canAfford(cost) {
        return this.gameState.money >= cost;
    }

    purchase(costKey, callback) {
        const cost = this.costs[costKey];
        if (this.canAfford(cost)) {
            this.gameState.subtractMoney(cost);
            this.gameState.recordMoneySpent(cost);
            this.costs[costKey] += COST_INCREMENTS[costKey] || COST_INCREMENTS.UPGRADE;
            if (callback) callback();
            return true;
        }
        return false;
    }

    purchaseBuilding(buildingType, costKey) {
        const buildingConfig = Object.values(BUILDING_TYPES).find(b => b.id === buildingType);
        if (!buildingConfig) return false;

        const placement = this.spawnManager.findBuildingPlacement(
            buildingConfig.range,
            buildingConfig.size,
            buildingType,
            this.spawnManager.getBuildings()
        );

        if (placement && this.purchase(costKey)) {
            this.spawnManager.spawnBuilding(buildingType, placement.x, placement.y);
            this.gameState.recordBuildingPlaced();
            return true;
        }
        return false;
    }

    purchaseCannon() {
        return this.purchaseBuilding(0, 'CANNON');
    }

    purchaseMultiCannon() {
        return this.purchaseBuilding(1, 'MULTI_CANNON');
    }

    purchaseHugeCannon() {
        return this.purchaseBuilding(2, 'HUGE_CANNON');
    }

    purchaseLaser() {
        return this.purchaseBuilding(3, 'LASER');
    }

    purchaseFrostLaser() {
        return this.purchaseBuilding(4, 'FROST_LASER');
    }

    purchaseChainLaser() {
        return this.purchaseBuilding(5, 'CHAIN_LASER');
    }

    purchaseCannonFactory() {
        return this.purchaseBuilding(6, 'CANNON_FACTORY');
    }

    purchasePierceLaser() {
        return this.purchaseBuilding(7, 'PIERCE_LASER');
    }

    purchaseScatterCannon() {
        return this.purchaseBuilding(8, 'SCATTER_CANNON');
    }

    purchaseBank() {
        if (this.purchaseBuilding(19, 'BANK')) {
            this.gameState.bankAmount += 1;
            return true;
        }
        return false;
    }

    purchaseKillRandom() {
        const enemies = this.spawnManager.getEnemies();
        if (enemies.length === 0) return false;

        if (this.purchase('KILL_RANDOM')) {
            for (let k = 0; k < this.gameState.utilityLevel; k++) {
                if (enemies.length > 0) {
                    const randomTarget = Math.floor(Math.random() * enemies.length);
                    enemies[randomTarget].dead = true;
                }
            }
            this.costs.KILL_RANDOM += Math.floor(this.gameState.getRoundNumber() / 1000) * 5;
            return true;
        }
        return false;
    }

    purchaseSlowAll() {
        const enemies = this.spawnManager.getEnemies();
        if (enemies.length === 0) return false;

        if (this.purchase('SLOW_ALL')) {
            let slowAmount = 1;
            for (let i = 0; i < this.gameState.utilityLevel; i++) {
                slowAmount *= 0.8;
            }
            for (const enemy of enemies) {
                enemy.setSpeed(enemy.baseSpeed * slowAmount);
            }
            this.costs.SLOW_ALL += Math.floor(this.gameState.getRoundNumber() / 1000) * 5;
            return true;
        }
        return false;
    }

    purchaseUpgradeCannons() {
        if (this.purchase('UPGRADE_CANNONS')) {
            this.gameState.canonLevel += 1;
            this.upgradeManager.upgradeCannons();
            return true;
        }
        return false;
    }

    purchaseUpgradeLasers() {
        if (this.purchase('UPGRADE_LASERS')) {
            this.gameState.laserLevel += 1;
            this.upgradeManager.upgradeLasers();
            return true;
        }
        return false;
    }

    purchaseUpgradeUtility() {
        if (this.purchase('UPGRADE_UTILITY')) {
            this.gameState.utilityLevel += 1;
            return true;
        }
        return false;
    }

    getCost(costKey) {
        return this.costs[costKey] || 0;
    }
}

