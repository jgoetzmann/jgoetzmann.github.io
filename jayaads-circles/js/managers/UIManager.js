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
    }

    updateStats() {
        if (this.roundUI) this.roundUI.innerHTML = `Round: ${this.gameState.getRoundNumber()}`;
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
        if (enemy.property === 2) {
            this.ctx.fillStyle = '#b5e2ff'; // blue
        } else if (enemy.property === 1) {
            this.ctx.fillStyle = '#feb1b1'; // red
        } else {
            this.ctx.fillStyle = '#232323'; // black
        }
        this.ctx.fillRect(enemy.positionX, enemy.positionY, enemy.size, enemy.size);
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

