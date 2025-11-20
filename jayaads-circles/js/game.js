import { GameState } from './core/GameState.js';
import { SpawnManager } from './managers/SpawnManager.js';
import { AttackManager } from './managers/AttackManager.js';
import { CollisionManager } from './managers/CollisionManager.js';
import { PurchaseManager } from './managers/PurchaseManager.js';
import { UpgradeManager } from './managers/UpgradeManager.js';
import { UIManager } from './managers/UIManager.js';
import { HighScoreManager } from './managers/HighScoreManager.js';
import { Projectile } from './entities/Projectile.js';
import { GAME_CONFIG, BUILDING_TYPES } from './utils/Constants.js';

// Initialize game
const map = document.getElementById('map');
const gameState = new GameState();
const spawnManager = new SpawnManager();
const upgradeManager = new UpgradeManager(spawnManager);
const purchaseManager = new PurchaseManager(gameState, spawnManager, upgradeManager);
const attackManager = new AttackManager();
const uiManager = new UIManager(map, gameState);
const highScoreManager = new HighScoreManager();

// Make highScoreManager globally accessible for menu
window.highScoreManager = highScoreManager;

// Link spawnManager to gameState for upgrades
spawnManager.gameState = gameState;

// Tab visibility handling
let isTabVisible = !document.hidden;
document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (!isTabVisible && !gameState.runWhenHidden) {
        gameState.isPaused = true;
    } else if (isTabVisible) {
        gameState.isPaused = false;
    }
});


function startNewGame() {
    gameState.reset();
    spawnManager.getEnemies().length = 0;
    spawnManager.getBuildings().length = 0;
    attackManager.getProjectiles().length = 0;
    uiManager.moneyGains.length = 0;
    gameState.startGame();
    uiManager.hideMenu();
}

window.restartGame = startNewGame;

// Wait for DOM to be ready for menu button
setTimeout(() => {
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startNewGame);
    }
    
    const runWhenHiddenCheckbox = document.getElementById('run-when-hidden');
    if (runWhenHiddenCheckbox) {
        runWhenHiddenCheckbox.addEventListener('change', (e) => {
            gameState.runWhenHidden = e.target.checked;
            if (e.target.checked) {
                gameState.isPaused = false;
            } else if (!isTabVisible) {
                gameState.isPaused = true;
            }
        });
    }
    
    // Fast forward button
    const fastForwardBtn = document.getElementById('fast-forward-btn');
    if (fastForwardBtn) {
        fastForwardBtn.addEventListener('click', () => {
            // Cycle through speeds: 1x -> 3x -> 5x -> 1x
            if (gameState.speedMultiplier === 1) {
                gameState.speedMultiplier = 3;
                fastForwardBtn.textContent = '⏩ Fast Forward (3x)';
                fastForwardBtn.style.backgroundColor = '#ff6b00';
            } else if (gameState.speedMultiplier === 3) {
                gameState.speedMultiplier = 5;
                fastForwardBtn.textContent = '⏩ Fast Forward (5x)';
                fastForwardBtn.style.backgroundColor = '#ff3636';
            } else {
                gameState.speedMultiplier = 1;
                fastForwardBtn.textContent = '⏩ Fast Forward (1x)';
                fastForwardBtn.style.backgroundColor = '#555';
            }
        });
    }
}, 100);

// Purchase functions (global for onclick handlers)
window.purchase1 = function() {
    if (purchaseManager.purchaseCannon()) {
        uiManager.updateButtonText('button1', `Buy Cannon! ($${purchaseManager.getCost('CANNON')})`);
    }
};

window.purchase2 = function() {
    if (purchaseManager.purchaseMultiCannon()) {
        uiManager.updateButtonText('button2', `Buy Multi Cannon! ($${purchaseManager.getCost('MULTI_CANNON')})`);
    }
};

window.purchase3 = function() {
    if (purchaseManager.purchaseHugeCannon()) {
        uiManager.updateButtonText('button3', `Buy Huge Cannon! ($${purchaseManager.getCost('HUGE_CANNON')})`);
    }
};

window.purchase4 = function() {
    if (purchaseManager.purchaseLaser()) {
        uiManager.updateButtonText('button4', `Buy Laser! ($${purchaseManager.getCost('LASER')})`);
    }
};

window.purchase5 = function() {
    if (purchaseManager.purchaseFrostLaser()) {
        uiManager.updateButtonText('button5', `Buy Frost Laser! ($${purchaseManager.getCost('FROST_LASER')})`);
    }
};

window.purchase6 = function() {
    if (purchaseManager.purchaseChainLaser()) {
        uiManager.updateButtonText('button6', `Buy Chain Laser! ($${purchaseManager.getCost('CHAIN_LASER')})`);
    }
};

window.purchase7 = function() {
    if (purchaseManager.purchaseKillRandom()) {
        uiManager.updateButtonText('button7', `Kill Random! ($${purchaseManager.getCost('KILL_RANDOM')})`);
    }
};

window.purchase8 = function() {
    if (purchaseManager.purchaseSlowAll()) {
        uiManager.updateButtonText('button8', `Slow All! ($${purchaseManager.getCost('SLOW_ALL')})`);
    }
};

window.purchase9 = function() {
    if (purchaseManager.purchaseBank()) {
        uiManager.updateButtonText('button9', `Buy Bank! ($${purchaseManager.getCost('BANK')})`);
    }
};

window.purchase10 = function() {
    if (purchaseManager.purchaseUpgradeCannons()) {
        uiManager.updateButtonText('button10', `Upgrade Cannons! ($${purchaseManager.getCost('UPGRADE_CANNONS')})`);
    }
};

window.purchase11 = function() {
    if (purchaseManager.purchaseUpgradeLasers()) {
        uiManager.updateButtonText('button11', `Upgrade Lasers! ($${purchaseManager.getCost('UPGRADE_LASERS')})`);
    }
};

window.purchase12 = function() {
    if (purchaseManager.purchaseUpgradeUtility()) {
        uiManager.updateButtonText('button12', `Upgrade Utility! ($${purchaseManager.getCost('UPGRADE_UTILITY')})`);
    }
};

window.purchase13 = function() {
    if (purchaseManager.purchaseCannonFactory()) {
        uiManager.updateButtonText('button13', `Buy Cannon Factory! ($${purchaseManager.getCost('CANNON_FACTORY')})`);
    }
};

window.purchase14 = function() {
    if (purchaseManager.purchasePierceLaser()) {
        uiManager.updateButtonText('button14', `Buy Pierce Laser! ($${purchaseManager.getCost('PIERCE_LASER')})`);
    }
};

window.purchase15 = function() {
    if (purchaseManager.purchaseScatterCannon()) {
        uiManager.updateButtonText('button15', `Buy Scatter Cannon! ($${purchaseManager.getCost('SCATTER_CANNON')})`);
    }
};

// Form functions
window.openForm = function() {
    document.getElementById('myForm').style.display = 'block';
};

window.closeForm = function() {
    document.getElementById('myForm').style.display = 'none';
};

// Game loop functions
function updateEnemyPositions() {
    const enemies = spawnManager.getEnemies();
    for (const enemy of enemies) {
        enemy.updatePosition();
        if (enemy.isOffScreen()) {
            enemy.dead = true;
            gameState.subtractLives(enemy.getLivesCost());
        }
    }
}

function processBuildingAttacks() {
    const buildings = spawnManager.getBuildings();
    const enemies = spawnManager.getEnemies();
    
    for (let i = buildings.length - 1; i >= 0; i--) {
        const building = buildings[i];
        
        // Handle moving cannons (cars)
        if (building.isMovingCannon()) {
            const damage = building.damage;
            if (CollisionManager.carCollision(building, enemies, damage, building.property) || 
                building.positionY < 0) {
                spawnManager.removeBuilding(building);
                continue;
            }
        }
        
        // Handle pellets
        if (building.isPellet()) {
            const shouldRemove = (building.side === 1 && (building.positionY < 201 || 
                CollisionManager.pelletCollision(building, enemies, building.property))) ||
                (building.side === 0 && (building.positionY > 279 || 
                CollisionManager.pelletCollision(building, enemies, building.property)));
            
            if (shouldRemove) {
                spawnManager.removeBuilding(building);
                continue;
            }
        }
        
        // Handle attacks
        if (building.canAttack(gameState.round)) {
            // Track damage
            if (building.damage > 0) {
                gameState.recordDamage(building.damage);
            }
            let enemyTarget = false;
            const superLaserTargets = [];
            
            switch (building.typeId) {
                case 0: // cannon
                case 2: // huge cannon
                case 3: // laser
                case 4: // frost laser
                case 17: // moving cannon
                    enemyTarget = attackManager.findEnemy(building, enemies, 1, building.property);
                    break;
                    
                case 1: // multi cannon
                case 5: // chain laser
                    const usedTargets = new Set();
                    for (let j = 0; j < building.targets; j++) {
                        const target = attackManager.findEnemy(building, enemies, 1, building.property, usedTargets);
                        if (target !== false && !usedTargets.has(target)) {
                            superLaserTargets.push(target);
                            usedTargets.add(target);
                        }
                    }
                    break;
                    
                case 7: // pierce laser
                    superLaserTargets.push(...attackManager.findPierceTargets(building, enemies));
                    break;
                    
                case 6: // cannon factory
                    const car = spawnManager.spawnCar(building.positionX, building.positionY);
                    console.log(`${building.name} spawned ${car.name}`);
                    continue;
                    
                case 8: // scatter cannon
                    for (let k = 0; k < building.targets; k++) {
                        const side = building.positionY < 280 ? 0 : 1;
                        spawnManager.spawnPellet(building.positionX, building.positionY, side);
                    }
                    continue;
                    
                case 19: // bank
                    const moneyAward = 15 + (5 * gameState.utilityLevel);
                    gameState.addMoney(moneyAward);
                    gameState.recordMoneyEarned(moneyAward);
                    uiManager.addMoneyGain(moneyAward, building.positionX, building.positionY - 20);
                    continue;
            }
            
            // Execute attacks
            if (enemyTarget !== false && enemies[enemyTarget]) {
                const enemy = enemies[enemyTarget];
                
                switch (building.typeId) {
                    case 0: // cannon
                        attackManager.attackCannon(building, enemy, attackManager.getProjectiles());
            break;
                    case 2: // huge cannon
                        attackManager.attackHugeCannon(building, enemy, gameState.canonLevel, attackManager.getProjectiles());
            break;
        case 3: // laser
                        attackManager.attackLaser(building, enemy, gameState.laserLevel);
                        attackManager.getProjectiles().push(new Projectile(
                            building.positionX, building.positionY,
                            enemy.getCenterX(), enemy.getCenterY(),
                            3, 5
                        ));
            break;
        case 4: // frost laser
                        attackManager.attackFrostLaser(building, enemy);
                        attackManager.getProjectiles().push(new Projectile(
                            building.positionX, building.positionY,
                            enemy.getCenterX(), enemy.getCenterY(),
                            4, 5
                        ));
            break;
                    case 17: // moving cannon
                        attackManager.attackCannon(building, enemy, attackManager.getProjectiles());
            break;
                }
            }
            
            // Multi-target attacks
            if (superLaserTargets.length > 0) {
                switch (building.typeId) {
                    case 1: // multi cannon
                        attackManager.attackMultiCannon(building, superLaserTargets, enemies, attackManager.getProjectiles());
                        break;
                    case 5: // chain laser
                        attackManager.attackChainLaser(building, superLaserTargets, enemies, attackManager.getProjectiles());
                            break;
                        case 7: // pierce laser
                        const result = attackManager.attackPierceLaser(building, superLaserTargets, enemies);
                        if (result.projectile) {
                            attackManager.getProjectiles().push(result.projectile);
                                }
                                break;
                }
            }
        }
    }
}

function clearDeadEnemies() {
    const enemies = spawnManager.getEnemies();
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (enemy.dead || enemy.hp < 1) {
            // Award money
            const moneyAward = Math.floor(enemy.size * (1.6 + (0.4 * gameState.utilityLevel)));
            if (enemy.id !== 0) {
                gameState.addMoney(moneyAward);
                gameState.recordMoneyEarned(moneyAward);
                gameState.recordKill();
                uiManager.addMoneyGain(moneyAward, enemy.getCenterX(), enemy.positionY - 20);
            }
            spawnManager.removeEnemy(enemy);
        }
    }
}

function endRoundCash() {
    if (gameState.shouldEndRound()) {
        const endOfRoundMoney = 90 + (gameState.round / 100);
        gameState.addMoney(endOfRoundMoney);
        gameState.recordMoneyEarned(endOfRoundMoney);
        uiManager.addMoneyGain(endOfRoundMoney, 190, 42);
    }
}

function gameLoop() {
    // This function now runs at fixed intervals (20ms)
    // All state checks are done in timeBasedGameLoop
    gameState.incrementRound();
    
    // Spawn units
    if (gameState.shouldSpawnUnit()) {
        const enemy = spawnManager.spawnEnemy(gameState.round);
        if (enemy) {
            gameState.recordEnemySpawned();
        }
    }
    
    // Update game
    uiManager.clearMap();
    updateEnemyPositions();
    processBuildingAttacks();
    clearDeadEnemies();
    endRoundCash();
    
    // Draw everything
    const buildings = spawnManager.getBuildings();
    for (const building of buildings) {
        uiManager.drawBuilding(building);
    }
    
    const enemies = spawnManager.getEnemies();
    for (const enemy of enemies) {
        uiManager.drawEnemy(enemy);
    }
    
    // Draw projectiles
    attackManager.updateProjectiles();
    const projectiles = attackManager.getProjectiles();
    for (const projectile of projectiles) {
        uiManager.drawProjectile(projectile);
    }
    
    // Draw money gains
    uiManager.drawMoneyGains();
    
    // Update UI
    uiManager.updateStats();
    
    // Check game over
    if (gameState.isGameOver() && gameState.updateUI) {
        gameState.updateUI = false;
        gameState.stats.endTime = Date.now();
        gameState.lives = 'Dead';
        uiManager.updateStats();
        
        const finalStats = {
            round: gameState.getRoundNumber(),
            kills: gameState.stats.kills,
            moneyEarned: gameState.stats.moneyEarned,
            moneySpent: gameState.stats.moneySpent,
            buildingsPlaced: gameState.stats.buildingsPlaced,
            totalDamage: gameState.stats.totalDamage,
            duration: gameState.getGameDuration()
        };
        
        // Save high score
        highScoreManager.saveHighScore(finalStats);
        
        // Show death popup
        uiManager.showDeathPopup(finalStats, highScoreManager);
    }
    
    // Check win condition
    if (gameState.round === GAME_CONFIG.WIN_ROUND) {
        alert('Congratulations on Beating the Game! Every Round that went by was 20 Seconds Wasted in your Life! If you got here Legit Good Job if not you Found an Exploit Yay! You may Continue on in Freeplay and Flex on your Friends!');
    }
}

// Time-based game loop to handle tab throttling
let lastUpdateTime = performance.now();
let accumulatedTime = 0;
const TARGET_FPS = 50; // 50 FPS = 20ms per frame
const FRAME_TIME = 1000 / TARGET_FPS;

function timeBasedGameLoop(currentTime) {
    if (!gameState.updateUI || gameState.isMenuOpen) {
        requestAnimationFrame(timeBasedGameLoop);
        return;
    }
    
    if (gameState.isPaused) {
        lastUpdateTime = currentTime;
        requestAnimationFrame(timeBasedGameLoop);
        return;
    }
    
    // Calculate delta time
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;
    
    // Accumulate time (multiplied by speed)
    accumulatedTime += deltaTime * gameState.speedMultiplier;
    
    // Run game updates in fixed steps
    // This ensures consistent game speed even if browser throttles
    const maxSteps = Math.min(5 * gameState.speedMultiplier, 20); // Prevent spiral of death, but allow more steps for fast forward
    let steps = 0;
    
    while (accumulatedTime >= FRAME_TIME && steps < maxSteps) {
        gameLoop();
        accumulatedTime -= FRAME_TIME;
        steps++;
    }
    
    // Cap accumulated time to prevent huge jumps when tab becomes visible
    if (accumulatedTime > FRAME_TIME * 10) {
        accumulatedTime = FRAME_TIME * 10;
    }
    
    requestAnimationFrame(timeBasedGameLoop);
}

// Start the game loop
requestAnimationFrame(timeBasedGameLoop);
