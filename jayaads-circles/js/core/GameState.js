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

    getRoundNumber() {
        return Math.floor(this.round / GAME_CONFIG.ROUND_DURATION);
    }

    shouldSpawnUnit() {
        return Number.isInteger(this.round / GAME_CONFIG.SPAWN_INTERVAL);
    }

    shouldEndRound() {
        return Number.isInteger(this.round / GAME_CONFIG.ROUND_DURATION);
    }
}

