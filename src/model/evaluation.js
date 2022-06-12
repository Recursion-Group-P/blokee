import { BONUS_POINTS } from "src/constants";

export class Evaluation {
    constructor(players) {
        this.players = players;
    }

    // return: boolean
    checkIfGameIsOver() {
        // 1. 全てのplayerが全てのピースを使い切ったか確認
        let allPlayersUsedUpAllPieces = true;
        for (let i = 0; i < this.players.length; i++) {
            let remainingPieces = this.players[i].remainingPieces;
            allPlayersUsedUpAllPieces = this.checkIfUsedUpAllPieces(remainingPieces);
        }

        // 2. 全てのplayerのoutOfGameがtrueになっているか確認
        // outOfGameがtrueのplayerをカウント
        let outOfGameCount = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].outOfGame === true) outOfGameCount++;
        }
        let allPlayersOutOfGame = true;
        if (outOfGameCount < this.players.length) allPlayersOutOfGame = false;

        // 1, 2のどちらかがtrueの時にゲームを終了する
        let gameIsOver = allPlayersUsedUpAllPieces || allPlayersOutOfGame;

        return gameIsOver;
    }

    // return: boolean
    checkIfUsedUpAllPieces(remainingPieces) {
        let remainingPiecesCounter = 0;
        for (let i = 0; i < Object.keys(remainingPieces).length; i++) {
            if (remainingPieces[i].isUsed === false) remainingPiecesCounter++;
        }

        return remainingPiecesCounter === 0;
    }

    // return: object
    getFinalResult() {
        let finalResult = [];
        let players = this.players;

        for (let i = 0; i < players.length; i++) {
            if (this.checkIfUsedUpAllPieces(players[i].remainingPieces))
                players[i].score += BONUS_POINTS["usedUpAllPieces"];
            finalResult.push({
                playerId: i,
                score: players[i].score,
                remainingTime: players[i].remainingTime,
            });
        }

        // scoreの降順にしてから、remainingTimeの降順に並び替える
        let sortedFinalResult = finalResult.sort(function (a, b) {
            if (a.score !== b.score) return a.score < b.score ? 1 : -1;
            if (a.remainingTime !== b.remainingTime)
                return a.remainingTime < b.remainingTime ? 1 : -1;
        });

        return sortedFinalResult;
    }

    // return: int
    getLastOnePieceBonus(currentPlayerId) {
        if (this.checkIfTheLastPieceHasOnlyOneCell(currentPlayerId)) return BONUS_POINTS["lastOneCellPiece"];
        else return 0;
    }

    // return: boolean
    // 残り１ピースかつ、それが１マスのピースの時にtrueを返す
    checkIfTheLastPieceHasOnlyOneCell(currentPlayerId) {
        let remainingPieces = this.players[currentPlayerId].remainingPieces;

        let remainingPiecesCounter = 0;
        for (let i = 0; i < Object.keys(remainingPieces).length; i++) {
            if (remainingPieces[i].isUsed === false) remainingPiecesCounter++;
        }
        return remainingPiecesCounter === 1 && !remainingPieces[0].isUsed; // remainingPieces[0]は１マスのピース
    }
}
