import { CollisionHelper } from '../utils/Helpers.js';

export class CollisionManager {
    static carCollision(car, enemies, damage, buildingProperty) {
        car.positionX -= 1.6;
        const circle = { x: car.positionX, y: car.positionY, r: car.size };
        
        for (const enemy of enemies) {
            const rect = { x: enemy.positionX, y: enemy.positionY, w: enemy.size, h: enemy.size };
            if (CollisionHelper.circleSquareCollision(circle, rect)) {
                if (enemy.property !== buildingProperty) {
                    enemy.takeDamage(damage);
                    return true;
                }
            }
        }
        return false;
    }

    static pelletCollision(pellet, enemies, buildingProperty) {
        pellet.positionX += 1; // move forward
        if (pellet.side === 1) {
            pellet.positionY -= 1;
        } else {
            pellet.positionY += 1;
        }

        const circle = { x: pellet.positionX, y: pellet.positionY, r: pellet.size };
        
        for (const enemy of enemies) {
            const rect = { x: enemy.positionX, y: enemy.positionY, w: enemy.size, h: enemy.size };
            if (CollisionHelper.circleSquareCollision(circle, rect)) {
                if (enemy.property !== buildingProperty) {
                    let subtractAmount;
                    if (pellet.side === 0) {
                        subtractAmount = Math.ceil(pellet.damage * ((300 - pellet.positionY) / 100));
                    } else {
                        subtractAmount = Math.ceil(pellet.damage * ((pellet.positionY - 180) / 100));
                    }
                    enemy.takeDamage(subtractAmount);
                    return true;
                }
            }
        }
        return false;
    }
}

