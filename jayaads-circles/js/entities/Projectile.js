export class Projectile {
    constructor(startX, startY, endX, endY, type, duration = 5) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.type = type;
        this.duration = duration;
    }

    update() {
        this.duration -= 1;
    }

    isExpired() {
        return this.duration < 1;
    }
}

export class MoneyGain {
    constructor(amount, x, y, duration = 50) {
        this.amount = amount;
        this.x = x;
        this.y = y;
        this.duration = duration;
    }

    update() {
        this.duration -= 1;
    }

    isExpired() {
        return this.duration < 1;
    }
}

