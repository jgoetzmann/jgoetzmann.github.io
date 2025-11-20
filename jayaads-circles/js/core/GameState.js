import { GAME_CONFIG } from '../utils/Constants.js';

export class GameState {
    constructor() {
        this.money = GAME_CONFIG.INITIAL_MONEY;
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.round = GAME_CONFIG.INITIAL_ROUND;
        this.bankAmount = 0;
        this.canonLevel = 1;
        this.laserLevel = 1;
        this.utilityLevel = 1;
        this.updateUI = true;
        this.isPaused = false;
        this.isMenuOpen = true;
        this.runWhenHidden = false;
        this.speedMultiplier = 1; // 1 = normal, 2 = 2x speed, etc.
        this.difficulty = 'NORMAL'; // NORMAL, HARD, VERY_HARD
        
        // Game time tracking (accounts for speed multiplier)
        this.gameTime = 0; // Total game time in milliseconds (adjusted for speed)
        this.lastGameTimeUpdate = null;
        
        // Stats tracking
        this.stats = {
            kills: 0,
            moneyEarned: 0,
            moneySpent: 0,
            buildingsPlaced: 0,
            enemiesSpawned: 0,
            totalDamage: 0,
            startTime: null,
            endTime: null
        };
    }
    
    reset() {
        this.money = GAME_CONFIG.INITIAL_MONEY;
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.round = GAME_CONFIG.INITIAL_ROUND;
        this.bankAmount = 0;
        this.canonLevel = 1;
        this.laserLevel = 1;
        this.utilityLevel = 1;
        this.updateUI = true;
        this.isPaused = false;
        this.speedMultiplier = 1;
        this.difficulty = 'NORMAL';
        this.gameTime = 0;
        this.lastGameTimeUpdate = null;
        this.stats = {
            kills: 0,
            moneyEarned: 0,
            moneySpent: 0,
            buildingsPlaced: 0,
            enemiesSpawned: 0,
            totalDamage: 0,
            startTime: null,
            endTime: null
        };
    }
    
    startGame() {
        this.isMenuOpen = false;
        this.stats.startTime = Date.now();
        this.lastGameTimeUpdate = performance.now();
        this.gameTime = 0;
    }
    
    updateGameTime(currentTime) {
        if (!this.lastGameTimeUpdate) {
            this.lastGameTimeUpdate = currentTime;
            return;
        }
        if (!this.isPaused && !this.isMenuOpen) {
            const deltaTime = currentTime - this.lastGameTimeUpdate;
            this.gameTime += deltaTime * this.speedMultiplier;
        }
        this.lastGameTimeUpdate = currentTime;
    }
    
    getGameTimeSeconds() {
        return this.gameTime / 1000;
    }
    
    recordKill() {
        this.stats.kills++;
    }
    
    recordMoneyEarned(amount) {
        this.stats.moneyEarned += amount;
    }
    
    recordMoneySpent(amount) {
        this.stats.moneySpent += amount;
    }
    
    recordBuildingPlaced() {
        this.stats.buildingsPlaced++;
    }
    
    recordEnemySpawned() {
        this.stats.enemiesSpawned++;
    }
    
    recordDamage(amount) {
        this.stats.totalDamage += amount;
    }
    
    getGameDuration() {
        if (!this.stats.startTime) return 0;
        const end = this.stats.endTime || Date.now();
        return Math.floor((end - this.stats.startTime) / 1000);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    incrementRound() {
        this.round += 1;
    }

    addMoney(amount) {
        this.money += amount;
    }

    subtractMoney(amount) {
        this.money -= amount;
    }

    subtractLives(amount) {
        this.lives -= amount;
    }

    isGameOver() {
        return this.lives < 0;
    }

    // Round is now only used for building attack timing (frame counter)
    // All other round-based logic has been removed in favor of wave system
}

