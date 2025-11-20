import { MoneyGain } from '../entities/Projectile.js';
import { PROJECTILE_COLORS } from '../utils/Constants.js';

export class UIManager {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = gameState;
        this.moneyGains = [];
        this.roundUI = document.getElementById('round-ui');
        this.moneyUI = document.getElementById('money-ui');
        this.livesUI = document.getElementById('lives-ui');
        this.bankUI = document.getElementById('bank-ui');
        this.canonUI = document.getElementById('canon-ui');
        this.laserUI = document.getElementById('laser-ui');
        this.utilityUI = document.getElementById('utility-ui');
        this.initMenu();
    }
    
    initMenu() {
        // Create menu overlay
        const menuOverlay = document.createElement('div');
        menuOverlay.id = 'menu-overlay';
        menuOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const menuContent = document.createElement('div');
        menuContent.style.cssText = `
            background: #323639;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            color: white;
            max-width: 500px;
        `;
        
        menuContent.innerHTML = `
            <h1 style="font-size: 48px; margin-bottom: 20px;">Cubes vs Circles</h1>
            <h2 style="font-size: 24px; margin-bottom: 30px;">v0.6.3</h2>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">Difficulty:</label>
                <select id="difficulty-select" style="
                    padding: 8px 15px;
                    font-size: 16px;
                    background: #555;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    width: 100%;
                ">
                    <option value="NORMAL">Normal</option>
                    <option value="HARD">Hard</option>
                    <option value="VERY_HARD">Very Hard</option>
                </select>
            </div>
            <button id="start-game-btn" style="
                background: #154f30;
                color: white;
                border: none;
                padding: 15px 40px;
                font-size: 20px;
                cursor: pointer;
                margin: 10px;
                border-radius: 5px;
            ">Start Game</button>
            <br>
            <label style="display: block; margin-top: 20px;">
                <input type="checkbox" id="run-when-hidden" style="margin-right: 10px;">
                Run game when tab is hidden
            </label>
            <div id="high-scores" style="margin-top: 30px; text-align: left;">
                <h3>High Scores</h3>
                <div id="high-scores-list"></div>
            </div>
        `;
        
        menuOverlay.appendChild(menuContent);
        document.body.appendChild(menuOverlay);
        
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.hideMenu();
        });
        
        this.updateHighScores();
    }
    
    showMenu() {
        const overlay = document.getElementById('menu-overlay');
        if (overlay) overlay.style.display = 'flex';
        this.updateHighScores();
    }
    
    hideMenu() {
        const overlay = document.getElementById('menu-overlay');
        if (overlay) overlay.style.display = 'none';
    }
    
    updateHighScores() {
        const list = document.getElementById('high-scores-list');
        if (!list) return;
        
        // This will be populated by HighScoreManager
        const highScoreManager = window.highScoreManager;
        if (highScoreManager) {
            const scores = highScoreManager.getHighScores();
            if (scores.length === 0) {
                list.innerHTML = '<p style="color: #999;">No high scores yet!</p>';
            } else {
                list.innerHTML = scores.map((score, idx) => `
                    <div style="padding: 5px; border-bottom: 1px solid #555;">
                        <strong>#${idx + 1}</strong> Wave ${score.round} | 
                        ${score.kills} Kills | 
                        ${score.moneyEarned} Money
                    </div>
                `).join('');
            }
        }
    }
    
    showDeathPopup(stats, highScoreManager) {
        const popup = document.createElement('div');
        popup.id = 'death-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const isNewHigh = highScoreManager.isNewHighScore(stats.round, stats.kills);
        
        const popupContent = document.createElement('div');
        popupContent.style.cssText = `
            background: #323639;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            color: white;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        popupContent.innerHTML = `
            <h1 style="font-size: 36px; margin-bottom: 20px; color: #ff3636;">Game Over!</h1>
            ${isNewHigh ? '<h2 style="color: #ffd700; margin-bottom: 20px;">🏆 NEW HIGH SCORE! 🏆</h2>' : ''}
            <div style="text-align: left; margin: 20px 0;">
                <h3>Game Summary</h3>
                <p><strong>Wave Reached:</strong> ${stats.round}</p>
                <p><strong>Enemies Killed:</strong> ${stats.kills}</p>
                <p><strong>Money Earned:</strong> $${stats.moneyEarned}</p>
                <p><strong>Money Spent:</strong> $${stats.moneySpent}</p>
                <p><strong>Buildings Placed:</strong> ${stats.buildingsPlaced}</p>
                <p><strong>Total Damage Dealt:</strong> ${Math.floor(stats.totalDamage)}</p>
                <p><strong>Time Played:</strong> ${this.gameState.formatTime(stats.duration)}</p>
            </div>
            <button id="play-again-btn" style="
                background: #154f30;
                color: white;
                border: none;
                padding: 15px 40px;
                font-size: 20px;
                cursor: pointer;
                margin: 10px;
                border-radius: 5px;
            ">Play Again</button>
            <button id="main-menu-btn" style="
                background: #555;
                color: white;
                border: none;
                padding: 15px 40px;
                font-size: 20px;
                cursor: pointer;
                margin: 10px;
                border-radius: 5px;
            ">Main Menu</button>
        `;
        
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            document.body.removeChild(popup);
            if (window.restartGame) window.restartGame();
        });
        
        document.getElementById('main-menu-btn').addEventListener('click', () => {
            document.body.removeChild(popup);
            this.showMenu();
        });
    }

    updateStats() {
        // Show wave number instead of round number
        // Wave number should match the actual current wave (0 means no wave started yet)
        let waveNumber = 0;
        if (window.waveManager && window.waveManager.currentWave > 0) {
            waveNumber = window.waveManager.currentWave;
        }
        if (this.roundUI) this.roundUI.innerHTML = `Wave: ${waveNumber}`;
        if (this.moneyUI) this.moneyUI.innerHTML = `Money: ${Math.floor(this.gameState.money)}`;
        if (this.livesUI) this.livesUI.innerHTML = `Lives: ${this.gameState.lives}`;
        if (this.bankUI) this.bankUI.innerHTML = `Banks: ${this.gameState.bankAmount}`;
        if (this.canonUI) this.canonUI.innerHTML = `Canon Level: ${this.gameState.canonLevel}`;
        if (this.laserUI) this.laserUI.innerHTML = `Laser Level: ${this.gameState.laserLevel}`;
        if (this.utilityUI) this.utilityUI.innerHTML = `Utility Level: ${this.gameState.utilityLevel}`;
    }

    updateButtonText(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.innerHTML = text;
        }
    }

    addMoneyGain(amount, x, y) {
        this.moneyGains.push(new MoneyGain(amount, x, y));
    }

    drawMoneyGains() {
        for (let i = this.moneyGains.length - 1; i >= 0; i--) {
            const gain = this.moneyGains[i];
            if (gain.isExpired()) {
                this.moneyGains.splice(i, 1);
            } else {
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = '#154f30';
                this.ctx.font = '16px serif';
                this.ctx.fillText(`+$${gain.amount}`, gain.x, gain.y);
                gain.update();
            }
        }
    }

    clearMap() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#6b6b6b';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#dee1e6';
        this.ctx.fillRect(0, 200, this.canvas.width, 80);
    }

    drawEnemy(enemy) {
        // Draw enemy shape (square or hexagon)
        if (enemy.shape === 'hexagon') {
            // Draw hexagon for fortified enemies
            this.ctx.beginPath();
            const centerX = enemy.positionX + enemy.size / 2;
            const centerY = enemy.positionY + enemy.size / 2;
            const radius = enemy.size / 2;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            
            // Base color
            if (enemy.property === 2) {
                this.ctx.fillStyle = '#b5e2ff'; // blue
            } else if (enemy.property === 1) {
                this.ctx.fillStyle = '#feb1b1'; // red
            } else {
                this.ctx.fillStyle = '#232323'; // black
            }
            this.ctx.fill();
            
            // Draw modifier colors as border
            if (enemy.modifiers && enemy.modifiers.length > 0) {
                const modifier = enemy.modifiers[0]; // Show first modifier color
                this.ctx.strokeStyle = modifier.color || '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        } else {
            // Draw square
            if (enemy.property === 2) {
                this.ctx.fillStyle = '#b5e2ff'; // blue
            } else if (enemy.property === 1) {
                this.ctx.fillStyle = '#feb1b1'; // red
            } else {
                this.ctx.fillStyle = '#232323'; // black
            }
            this.ctx.fillRect(enemy.positionX, enemy.positionY, enemy.size, enemy.size);
            
            // Draw modifier color border
            if (enemy.modifiers && enemy.modifiers.length > 0) {
                const modifier = enemy.modifiers[0]; // Show first modifier color
                this.ctx.strokeStyle = modifier.color || '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(enemy.positionX, enemy.positionY, enemy.size, enemy.size);
            }
        }
    }

    drawBuilding(building) {
        this.ctx.beginPath();
        this.ctx.arc(building.positionX, building.positionY, building.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = building.getColor();
        this.ctx.fill();
    }

    drawProjectile(projectile) {
        const config = PROJECTILE_COLORS[projectile.type] || { color: '#232323', width: 5 };
        
        this.ctx.strokeStyle = config.color;
        this.ctx.lineWidth = config.width;
        this.ctx.beginPath();
        this.ctx.moveTo(projectile.startX, projectile.startY);
        this.ctx.lineTo(projectile.endX, projectile.endY);
        this.ctx.stroke();
    }
}

