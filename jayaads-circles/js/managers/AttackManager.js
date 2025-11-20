import { CollisionHelper } from '../utils/Helpers.js';
import { Projectile } from '../entities/Projectile.js';
import { ENEMY_TYPES } from '../utils/Constants.js';

export class AttackManager {
    constructor() {
        this.projectiles = [];
    }

    findEnemy(building, enemies, mode, buildingProperty, usedTargets = null) {
        const positionX = building.positionX;
        const positionY = building.positionY;
        const range = building.range * 2;

        if (mode === 0) { // Strongest first
            for (let j = Object.keys(ENEMY_TYPES).length - 1; j > 0; j--) {
                for (let k = 0; k < enemies.length; k++) {
                    const enemy = enemies[k];
                    if (enemy.id === j && 
                        CollisionHelper.circleCollision(
                            positionX, positionY, range,
                            enemy.getCenterX(), enemy.getCenterY(), enemy.getRadius()
                        ) && 
                        enemy.property !== buildingProperty &&
                        (!usedTargets || !usedTargets.has(k))) {
                        return k;
                    }
                }
            }
            return false;
        } else if (mode === 1) { // First (closest to exit)
            const sortedEnemies = enemies
                .map((e, idx) => ({ enemy: e, idx }))
                .sort((a, b) => b.enemy.positionX - a.enemy.positionX);
            
            for (const { enemy, idx } of sortedEnemies) {
                if (CollisionHelper.circleCollision(
                    positionX, positionY, range,
                    enemy.getCenterX(), enemy.getCenterY(), enemy.getRadius()
                ) && enemy.property !== buildingProperty &&
                (!usedTargets || !usedTargets.has(idx))) {
                    return idx;
                }
            }
            return false;
        } else if (mode === 2) { // Random
            for (let j = 0; j < 100; j++) {
                const targetSelection = Math.floor(Math.random() * enemies.length);
                const enemy = enemies[targetSelection];
                if (CollisionHelper.circleCollision(
                    positionX, positionY, range,
                    enemy.getCenterX(), enemy.getCenterY(), enemy.getRadius()
                ) && enemy.property !== buildingProperty) {
                    return targetSelection;
                }
            }
            return false;
        }
        return false;
    }

    findPierceTargets(building, enemies) {
        const targets = [];
        for (const enemy of enemies) {
            if (building.positionY < 280) { // top side
                if (CollisionHelper.squareSquareCollision(
                    building.positionX - 7.5, building.positionY, 15, building.range,
                    enemy.positionX, enemy.positionY, enemy.size, enemy.size
                )) {
                    targets.push(enemies.indexOf(enemy));
                }
            } else { // bottom side
                if (CollisionHelper.squareSquareCollision(
                    building.positionX - 7.5, building.positionY - building.range, 15, building.range,
                    enemy.positionX, enemy.positionY, enemy.size, enemy.size
                )) {
                    targets.push(enemies.indexOf(enemy));
                }
            }
        }
        return targets;
    }

    attackCannon(building, enemy, projectiles) {
        projectiles.push(new Projectile(
            building.positionX, building.positionY,
            enemy.getCenterX(), enemy.getCenterY(),
            0, 5
        ));
        enemy.takeDamage(building.damage);
        return `Cannon dealt ${building.damage} damage!`;
    }

    attackMultiCannon(building, targets, enemies, projectiles) {
        const results = [];
        for (const targetIdx of targets) {
            if (targetIdx !== false && enemies[targetIdx]) {
                const enemy = enemies[targetIdx];
                enemy.takeDamage(building.damage);
                projectiles.push(new Projectile(
                    building.positionX, building.positionY,
                    enemy.getCenterX(), enemy.getCenterY(),
                    1, 5
                ));
                results.push(`Multi Cannon dealt ${building.damage} damage!`);
            }
        }
        return results.join('\n');
    }

    attackHugeCannon(building, enemy, canonLevel, projectiles) {
        projectiles.push(new Projectile(
            building.positionX, building.positionY,
            enemy.getCenterX(), enemy.getCenterY(),
            2, 5
        ));
        enemy.positionX -= (5 + canonLevel); // knockback
        enemy.takeDamage(building.damage);
        return `Huge Cannon dealt ${building.damage} damage!`;
    }

    attackLaser(building, enemy, laserLevel) {
        let damage;
        if (enemy.id === 11) { // boss
            damage = 50 + (20 * laserLevel);
        } else {
            damage = Math.ceil((enemy.hp / 100) * building.damage);
        }
        enemy.takeDamage(damage);
        return `Laser dealt ${damage} damage!`;
    }

    attackFrostLaser(building, enemy) {
        enemy.setSpeed(enemy.baseSpeed * building.damage);
        return `Frost Laser slowed enemy!`;
    }

    attackChainLaser(building, targets, enemies, projectiles) {
        const results = [];
        for (let j = 0; j < targets.length; j++) {
            if (targets[j] !== false && enemies[targets[j]]) {
                const enemy = enemies[targets[j]];
                enemy.takeDamage(building.damage);
                if (j === 0) {
                    projectiles.push(new Projectile(
                        building.positionX, building.positionY,
                        enemy.getCenterX(), enemy.getCenterY(),
                        5, 5
                    ));
                } else if (targets[j - 1] !== false && enemies[targets[j - 1]]) {
                    const prevEnemy = enemies[targets[j - 1]];
                    projectiles.push(new Projectile(
                        prevEnemy.getCenterX(), prevEnemy.getCenterY(),
                        enemy.getCenterX(), enemy.getCenterY(),
                        5, 5
                    ));
                }
                results.push(`Chain Laser dealt ${building.damage} damage!`);
            }
        }
        return results.join('\n');
    }

    attackPierceLaser(building, targets, enemies) {
        let furthestDraw = 0;
        if (building.positionY < 280) {
            furthestDraw = building.positionY + building.range;
            if (furthestDraw > 280) furthestDraw = 280;
        } else {
            furthestDraw = building.positionY - building.range;
            if (furthestDraw < 200) furthestDraw = 200;
        }

        const projectile = new Projectile(
            building.positionX, building.positionY,
            building.positionX, furthestDraw,
            7, 8
        );

        const results = [];
        for (const targetIdx of targets) {
            if (enemies[targetIdx] && enemies[targetIdx].property !== building.property) {
                enemies[targetIdx].takeDamage(building.damage);
                results.push(`Pierce Laser dealt ${building.damage} damage!`);
            }
        }
        return { projectile, results: results.join('\n') };
    }

    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            if (this.projectiles[i].isExpired()) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    getProjectiles() {
        return this.projectiles;
    }
}

