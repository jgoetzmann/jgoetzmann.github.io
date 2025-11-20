import { GameState } from './core/GameState.js';
import { SpawnManager } from './managers/SpawnManager.js';
import { AttackManager } from './managers/AttackManager.js';
import { CollisionManager } from './managers/CollisionManager.js';
import { PurchaseManager } from './managers/PurchaseManager.js';
import { UpgradeManager } from './managers/UpgradeManager.js';
import { UIManager } from './managers/UIManager.js';
import { HighScoreManager } from './managers/HighScoreManager.js';
import { WaveManager, WAVE_CONFIG } from './utils/WaveSystem.js';
import { Projectile } from './entities/Projectile.js';
import { GAME_CONFIG, BUILDING_TYPES, PURCHASE_COSTS } from './utils/Constants.js';

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
    // Reset everything
    gameState.reset();
    // Get difficulty from dropdown, ensure it's uppercase
    const difficultySelect = document.getElementById('difficulty-select');
    const selectedDifficulty = (difficultySelect ? difficultySelect.value : window.selectedDifficulty || 'NORMAL').toUpperCase();
    gameState.difficulty = selectedDifficulty;
    window.selectedDifficulty = selectedDifficulty;
    
    spawnManager.getEnemies().length = 0;
    spawnManager.getBuildings().length = 0;
    attackManager.getProjectiles().length = 0;
    uiManager.moneyGains.length = 0;
    
    // Reset purchase costs
    purchaseManager.resetCosts();
    
    // Reset all button costs
    for (let i = 1; i <= 15; i++) {
        const btn = document.getElementById(`button${i}`);
        if (btn) {
            const originalTexts = {
                1: 'Buy Cannon! (Free)',
                2: 'Buy Multi Cannon! ($300)',
                3: 'Buy Huge Cannon! ($1600)',
                4: 'Buy Laser! ($675)',
                5: 'Buy Frost Laser! ($1250)',
                6: 'Buy Chain Laser! ($2400)',
                7: 'Kill Random! ($50)',
                8: 'Slow All! ($100)',
                9: 'Buy Bank! ($500)',
                10: 'Upgrade Cannons! ($2500)',
                11: 'Upgrade Lasers! ($2500)',
                12: 'Upgrade Utility! ($2500)',
                13: 'Buy Cannon Factory! ($1200)',
                14: 'Buy Pierce Laser! ($2000)',
                15: 'Buy Scatter Cannon! ($800)'
            };
            if (originalTexts[i]) {
                btn.innerHTML = originalTexts[i];
            }
        }
    }
    
    // Create new wave manager with selected difficulty
    window.waveManager = new WaveManager(selectedDifficulty);
    
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
    
    // Difficulty selector
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        window.selectedDifficulty = difficultySelect.value;
        difficultySelect.addEventListener('change', (e) => {
            window.selectedDifficulty = e.target.value;
        });
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
                fastForwardBtn.style.backgroundColor = '#ff6b00';
            } else if (gameState.speedMultiplier === 3) {
                gameState.speedMultiplier = 5;
                fastForwardBtn.style.backgroundColor = '#ff3636';
        } else {
                gameState.speedMultiplier = 1;
                fastForwardBtn.style.backgroundColor = '#555';
            }
        });
    }
    
    // Debug button
    const debugBtn = document.getElementById('debug-btn');
    const debugPanel = document.getElementById('debug-panel');
    if (debugBtn && debugPanel) {
        debugBtn.addEventListener('click', () => {
            const isVisible = debugPanel.style.display !== 'none';
            debugPanel.style.display = isVisible ? 'none' : 'block';
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
            const livesCost = enemy.getLivesCost();
            gameState.subtractLives(livesCost);
            // Check game over immediately
            if (gameState.isGameOver() && gameState.updateUI) {
                gameState.updateUI = false;
                gameState.stats.endTime = Date.now();
                gameState.lives = 'Dead';
                uiManager.updateStats();
                
                const finalStats = {
                    round: window.waveManager ? window.waveManager.currentWave : 0,
                    kills: gameState.stats.kills,
                    moneyEarned: gameState.stats.moneyEarned,
                    moneySpent: gameState.stats.moneySpent,
                    buildingsPlaced: gameState.stats.buildingsPlaced,
                    totalDamage: gameState.stats.totalDamage,
                    duration: gameState.getGameDuration()
                };
                
                highScoreManager.saveHighScore(finalStats);
                uiManager.showDeathPopup(finalStats, highScoreManager);
            }
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
            // Award money: simple formula based on enemy level
            let moneyAward = enemy.level * 20;
            moneyAward = Math.floor(moneyAward);
            
            if (enemy.level > 0) {
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
    // Periodic money bonus - every 20 seconds (1000 game loops at 50 FPS)
    // Using round as a simple frame counter for timing
    if (gameState.round % 1000 === 0 && gameState.round > 0) {
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
    
    // Update game time (accounts for speed multiplier)
    const currentTime = performance.now();
    gameState.updateGameTime(currentTime);
    
    // Wave-based spawning
    if (window.waveManager) {
        // Use game time for wave delays (accounts for speed multiplier)
        const gameTime = gameState.getGameTimeSeconds() * 1000;
        
        // Check if we should start a new wave FIRST
        if (window.waveManager.shouldStartWave(gameTime)) {
            // Wave is starting, first part will spawn immediately
            // Don't spawn part here, let the part check below handle it
        }
        
        // Check if we should spawn the next part
        if (window.waveManager.shouldSpawnPart(gameTime)) {
            const spawns = window.waveManager.spawnEnemiesForPart();
            for (const spawn of spawns) {
                const enemy = spawnManager.spawnEnemyForWave(spawn.level, spawn.modifiers, spawn.isFortified);
                if (enemy) {
                    gameState.recordEnemySpawned();
                }
            }
            
            // Mark that we've spawned this part and set delay for next part
            // Check if there are more parts BEFORE checking if wave is complete
            // (currentPart was incremented in shouldSpawnPart, so check if NEXT part exists)
            if (window.waveManager && window.waveManager.getMaxPartsForWave) {
                const maxParts = window.waveManager.getMaxPartsForWave();
                const nextPart = window.waveManager.currentPart + 1;
                
                if (nextPart > maxParts) {
                    // No more parts, wave is complete, wait for next wave
                    window.waveManager.startWaveDelay(gameTime);
    } else {
                    // More parts to come, wait for next part
                    window.waveManager.startPartDelay(gameTime);
                }
            }
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
    
    // Update debug panel if visible
    updateDebugPanel();
    
    // Check game over
    if (gameState.isGameOver() && gameState.updateUI) {
        gameState.updateUI = false;
        gameState.stats.endTime = Date.now();
        gameState.lives = 'Dead';
        uiManager.updateStats();
        
        const finalStats = {
            round: window.waveManager ? window.waveManager.currentWave : 0,
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
    
    // Check win condition (wave-based instead of round-based)
    if (window.waveManager && window.waveManager.currentWave >= 100) {
        alert('Congratulations on Beating the Game! Every Wave that went by was 30 Seconds Wasted in your Life! If you got here Legit Good Job if not you Found an Exploit Yay! You may Continue on in Freeplay and Flex on your Friends!');
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
    // Allow more steps for higher speed multipliers to actually achieve the speed
    const maxSteps = Math.min(10 * gameState.speedMultiplier, 50); // Increased limit for proper speed scaling
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

// Debug panel update function
function updateDebugPanel() {
    const debugPanel = document.getElementById('debug-panel');
    const debugContent = document.getElementById('debug-content');
    if (!debugPanel || !debugContent || debugPanel.style.display === 'none') {
        return;
    }
    
    const currentTime = performance.now();
    const enemies = spawnManager.getEnemies();
    const buildings = spawnManager.getBuildings();
    const projectiles = attackManager.getProjectiles();
    
    let debugInfo = '';
    
    // Time & Performance
    debugInfo += '<div style="color: #00ffff; margin-bottom: 8px;"><strong>⏱️ TIME & PERFORMANCE</strong></div>';
    debugInfo += `Game Time: ${gameState.getGameTimeSeconds().toFixed(2)}s<br>`;
    debugInfo += `Real Time: ${(currentTime / 1000).toFixed(2)}s<br>`;
    debugInfo += `Frame: ${gameState.round}<br>`;
    debugInfo += `Speed: ${gameState.speedMultiplier}x<br>`;
    debugInfo += `Paused: ${gameState.isPaused ? 'Yes' : 'No'}<br>`;
    debugInfo += `Menu Open: ${gameState.isMenuOpen ? 'Yes' : 'No'}<br>`;
    debugInfo += `<br>`;
    
    // Wave System
    debugInfo += '<div style="color: #ff00ff; margin-bottom: 8px;"><strong>🌊 WAVE SYSTEM</strong></div>';
    if (window.waveManager) {
        const wm = window.waveManager;
        const gameTime = gameState.getGameTimeSeconds() * 1000;
        debugInfo += `Wave: ${wm.currentWave}<br>`;
        debugInfo += `Part: ${wm.currentPart} / ${wm.getMaxPartsForWave()}<br>`;
        debugInfo += `Max Level: ${wm.getMaxLevelForWave()}<br>`;
        debugInfo += `Max Modifiers: ${wm.getMaxModifiersForWave()}<br>`;
        debugInfo += `Threat: ${wm.waveThreat.toFixed(0)}<br>`;
        debugInfo += `Difficulty: ${wm.difficulty}<br>`;
        debugInfo += `Waiting for Wave: ${wm.isWaitingForWave ? 'Yes' : 'No'}<br>`;
        debugInfo += `Waiting for Part: ${wm.isWaitingForPart ? 'Yes' : 'No'}<br>`;
        debugInfo += `Wave Complete: ${wm.isWaveComplete() ? 'Yes' : 'No'}<br>`;
        debugInfo += `Has More Parts: ${wm.hasMoreParts() ? 'Yes' : 'No'}<br>`;
        debugInfo += `partStartTime: ${wm.partStartTime === null ? 'null' : ((gameTime - wm.partStartTime) / 1000).toFixed(1) + 's ago'}<br>`;
        if (wm.waveStartTime) {
            const waveElapsed = (gameTime - wm.waveStartTime) / 1000;
            debugInfo += `Wave Time: ${waveElapsed.toFixed(1)}s<br>`;
        }
        if (wm.partStartTime && wm.isWaitingForPart) {
            const partElapsed = (gameTime - wm.partStartTime) / 1000;
            const remaining = (WAVE_CONFIG.PART_DELAY / 1000) - partElapsed;
            debugInfo += `Part Delay: ${remaining > 0 ? remaining.toFixed(1) + 's remaining' : 'READY'}<br>`;
        }
    } else {
        debugInfo += `Wave Manager: Not Initialized<br>`;
    }
    debugInfo += `<br>`;
    
    // Entities
    debugInfo += '<div style="color: #ffff00; margin-bottom: 8px;"><strong>🎯 ENTITIES</strong></div>';
    debugInfo += `Enemies: ${enemies.length}<br>`;
    debugInfo += `Buildings: ${buildings.length}<br>`;
    debugInfo += `Projectiles: ${projectiles.length}<br>`;
    
    // Enemy breakdown
    if (enemies.length > 0) {
        const enemyLevels = {};
        enemies.forEach(e => {
            enemyLevels[e.level] = (enemyLevels[e.level] || 0) + 1;
        });
        debugInfo += `Enemy Levels: `;
        const levelStr = Object.entries(enemyLevels)
            .map(([level, count]) => `L${level}:${count}`)
            .join(', ');
        debugInfo += (levelStr || 'None') + '<br>';
    }
    debugInfo += `<br>`;
    
    // Game State
    debugInfo += '<div style="color: #00ff00; margin-bottom: 8px;"><strong>💰 GAME STATE</strong></div>';
    debugInfo += `Money: $${gameState.money}<br>`;
    debugInfo += `Lives: ${gameState.lives}<br>`;
    debugInfo += `Bank: $${gameState.bankAmount.toFixed(0)}<br>`;
    debugInfo += `Canon Level: ${gameState.canonLevel}<br>`;
    debugInfo += `Laser Level: ${gameState.laserLevel}<br>`;
    debugInfo += `Utility Level: ${gameState.utilityLevel}<br>`;
    debugInfo += `<br>`;
    
    // Stats
    debugInfo += '<div style="color: #ff8800; margin-bottom: 8px;"><strong>📊 STATS</strong></div>';
    debugInfo += `Kills: ${gameState.stats.kills}<br>`;
    debugInfo += `Money Earned: $${gameState.stats.moneyEarned.toFixed(0)}<br>`;
    debugInfo += `Money Spent: $${gameState.stats.moneySpent.toFixed(0)}<br>`;
    debugInfo += `Buildings Placed: ${gameState.stats.buildingsPlaced}<br>`;
    debugInfo += `Enemies Spawned: ${gameState.stats.enemiesSpawned}<br>`;
    debugInfo += `Total Damage: ${gameState.stats.totalDamage.toFixed(0)}<br>`;
    if (gameState.stats.startTime) {
        const duration = gameState.getGameDuration();
        debugInfo += `Duration: ${gameState.formatTime(duration)}<br>`;
    }
    
    debugContent.innerHTML = debugInfo;
}

// Start the game loop
requestAnimationFrame(timeBasedGameLoop);
