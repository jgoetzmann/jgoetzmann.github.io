import { GAME_CONFIG, ENEMY_TYPES, BUILDING_TYPES } from './Constants.js';

// Collision detection helpers
export class CollisionHelper {
    static circleCollision(c1x, c1y, r1, c2x, c2y, r2) {
        const a = r1 + r2;
        const x = c1x - c2x;
        const y = c1y - c2y;
        return a > Math.sqrt((x * x) + (y * y));
    }

    static circleSquareCollision(circle, rect) {
        const distX = Math.abs(circle.x - rect.x - rect.w / 2);
        const distY = Math.abs(circle.y - rect.y - rect.h / 2);
        if (distX > (rect.w / 2 + circle.r)) return false;
        if (distY > (rect.h / 2 + circle.r)) return false;
        if (distX <= (rect.w / 2)) return true;
        if (distY <= (rect.h / 2)) return true;
        const dx = distX - rect.w / 2;
        const dy = distY - rect.h / 2;
        return (dx * dx + dy * dy <= (circle.r * circle.r));
    }

    static squareSquareCollision(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
        return (r1x < r2x + r2w &&
            r1x + r1w > r2x &&
            r1y < r2y + r2h &&
            r1y + r1h > r2y);
    }
}

// Position helpers
export class PositionHelper {
    static positionOffset(size) {
        return Math.random() * size + 200;
    }

    static getEnemySpawnY(enemyId) {
        const offsets = {
            11: PositionHelper.positionOffset(5),   // boss
            10: PositionHelper.positionOffset(30),   // huge
            9: PositionHelper.positionOffset(50),   // large-s
            8: PositionHelper.positionOffset(50),   // large-f
            7: PositionHelper.positionOffset(50),    // large
            6: PositionHelper.positionOffset(60),   // normal-s
            5: PositionHelper.positionOffset(60),   // normal-f
            4: PositionHelper.positionOffset(60),   // normal
            3: PositionHelper.positionOffset(70),   // small-f
            2: PositionHelper.positionOffset(70),   // small
            1: PositionHelper.positionOffset(75)     // tiny
        };
        return offsets[enemyId] || PositionHelper.positionOffset(75);
    }
}

// Math helpers
export class MathHelper {
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}

