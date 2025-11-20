export class HighScoreManager {
    constructor() {
        this.storageKey = 'cubesVsCircles_highScores';
    }

    getHighScores() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveHighScore(scoreData) {
        const scores = this.getHighScores();
        scores.push({
            ...scoreData,
            date: new Date().toISOString()
        });
        
        // Sort by wave (descending), then by kills
        scores.sort((a, b) => {
            if (b.round !== a.round) return b.round - a.round; // 'round' field now stores wave number
            return b.kills - a.kills;
        });
        
        // Keep top 10
        const topScores = scores.slice(0, 10);
        localStorage.setItem(this.storageKey, JSON.stringify(topScores));
        return topScores;
    }

    isNewHighScore(wave, kills) {
        const scores = this.getHighScores();
        if (scores.length < 10) return true;
        
        const lowestScore = scores[scores.length - 1];
        return wave > lowestScore.round || // 'round' field now stores wave number
               (wave === lowestScore.round && kills > lowestScore.kills);
    }
}

