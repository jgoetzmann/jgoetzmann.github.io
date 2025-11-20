import { BUILDING_TYPES } from '../utils/Constants.js';

export class UpgradeManager {
    constructor(spawnManager) {
        this.spawnManager = spawnManager;
    }

    upgradeCannons() {
        const buildings = this.spawnManager.getBuildings();
        const canonLevel = this.spawnManager.gameState?.canonLevel || 1;

        // Upgrade spawn templates (for future buildings)
        // This would be stored in a building template manager in a more complete refactor

        // Upgrade existing buildings
        for (const building of buildings) {
            if (building.typeId === 0) { // cannon
                building.upgradeDamage(10);
                building.upgradeAttackSpeed(-3);
                building.upgradeRange(10);
            } else if (building.typeId === 1) { // multi cannon
                building.upgradeDamage(7.5);
                building.upgradeRange(7.5);
                building.upgradeTargets(1);
            } else if (building.typeId === 2) { // huge cannon
                building.upgradeDamage(150);
                building.upgradeRange(20);
            } else if (building.typeId === 6.1 || building.typeId === 17) { // moving cannon
                building.upgradeDamage(Math.floor(50 * (1 + canonLevel) / 2));
                building.upgradeRange(10);
            } else if (building.typeId === 8) { // scatter cannon
                building.upgradeDamage(25);
                building.upgradeTargets(1);
            }
        }
    }

    upgradeLasers() {
        const buildings = this.spawnManager.getBuildings();

        for (const building of buildings) {
            if (building.typeId === 3) { // laser
                building.upgradeDamage(5);
                building.upgradeRange(5);
            } else if (building.typeId === 4) { // frost laser
                building.upgradeRange(10);
                if (building.damage > 0.2) {
                    building.damage -= 0.05;
                }
            } else if (building.typeId === 5) { // chain laser
                building.upgradeDamage(20);
                building.upgradeRange(20);
                building.upgradeTargets(1);
            } else if (building.typeId === 7) { // pierce laser
                building.upgradeDamage(125);
                building.upgradeRange(20);
            }
        }
    }
}

