export class Evaluation {
    constructor(players, gameOverCount) {
        this.players = players;
        this.gameOverCount = gameOverCount;
    }

    // boolean: true or false
    checkWinner() {
        // player全員の手元のピースの状況
        // gameOverCountがplayer.length
        let playersHaveRemainingPieces = true; // playersがpieceを持っているか
        for (let i = 0; i < this.players.length; i++) { }
    }

    // { 'Player1': [int score, int time], 'Player2': [int score, int time] }
    getFinalPlayerRank(playerTime) {
        this.players.score;
        playerTime;
    }
}
