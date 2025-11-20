import { ENEMY_TYPES, ENEMY_PROPERTIES, LIVES_COST } from '../utils/Constants.js';

export class Enemy {
    constructor(typeId, positionX = null, positionY = null, property = ENEMY_PROPERTIES.NONE) {
        const type = Object.values(ENEMY_TYPES).find(t => t.id === typeId);
        if (!type) {
            throw new Error(`Invalid enemy type ID: ${typeId}`);
        }

        this.name = type.name;
        this.hp = type.hp;
        this.maxHp = type.hp;
        this.positionX = positionX !== null ? positionX : type.positionX;
        this.positionY = positionY !== null ? positionY : type.positionY;
        this.speed = type.speed;
        this.baseSpeed = type.speed;
        this.size = type.size;
        this.dead = type.dead || false;
        this.id = type.id;
        this.property = property;
    }

    updatePosition() {
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
        return LIVES_COST[this.id] || 0;
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

    // For boss scaling
    scaleHp(amount) {
        this.hp += amount;
        this.maxHp += amount;
    }
}

