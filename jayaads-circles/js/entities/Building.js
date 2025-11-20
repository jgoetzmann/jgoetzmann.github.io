import { BUILDING_TYPES, BUILDING_COLORS } from '../utils/Constants.js';

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
        this.attackSpeed = type.attackSpeed;
        this.damage = type.damage;
        this.targets = type.targets;
        this.level = level;
        this.buffs = 0;
        this.lastAttackFrame = 0;
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

