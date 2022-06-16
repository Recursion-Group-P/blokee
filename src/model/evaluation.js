import { BONUS_POINTS } from "src/constants";
// import { mapActions } from "vuex";

export class Evaluation {
    constructor(players) {
        this.players = players;
    }

    // return: boolean
    checkIfGameIsOver() {
        // 1. 全てのplayerが全てのピースを使い切ったか確認
        let allPlayersUsedUpAllPieces = true;
        for (let player of this.players) {
            allPlayersUsedUpAllPieces = this.checkIfUsedUpAllPieces(player.remainingPieces);
        }

        // 2. 全てのplayerのoutOfGameがtrueになっているか確認
        // outOfGameがtrueのplayerをカウント
        let outOfGameCount = 0;
        for (const player of this.players) {
            if (player.outOfGame === true) outOfGameCount++;
        }

        return allPlayersUsedUpAllPieces || outOfGameCount === this.players.length;
    }

    // return: boolean
    checkIfUsedUpAllPieces(remainingPieces) {
        let remainingPiecesCounter = 0;
        for (const remainingPiece of Object.values(remainingPieces)) {
            if (remainingPiece.isUsed === false) remainingPiecesCounter++;
        }

        return remainingPiecesCounter === 0;
    }

    // return: array
    getFinalResults() {
        let finalResults = [];

        this.players.forEach((player, index) => {
            let usedUpAllPiecesBonus = 0;
            // usedUpAllPiecesBonus（+15pt）を付与するか判定
            if (this.checkIfUsedUpAllPieces(player.remainingPieces)) {
                usedUpAllPiecesBonus = BONUS_POINTS["usedUpAllPieces"];
            }
            finalResults.push({
                playerId: index,
                playerName: player.name,
                score: player.score,
                usedUpAllPiecesBonus: usedUpAllPiecesBonus,
                remainingTime: player.remainingTime,
            });
        });

        // scoreの降順にしてから、remainingTimeの降順に並び替える
        let sortedFinalResults = finalResults.sort(function (a, b) {
            if (a.score !== b.score) return a.score < b.score ? 1 : -1;
            if (a.remainingTime !== b.remainingTime)
                return a.remainingTime < b.remainingTime ? 1 : -1;
        });

        return sortedFinalResults;
    }

    // return: int
    getLastOnePieceBonus(currentPlayerId) {
        if (this.checkIfTheLastPieceHasOnlyOneCell(currentPlayerId))
            return BONUS_POINTS["lastOneCellPiece"];
        else return 0;
    }

    // return: boolean
    // 残り１ピースかつ、それが１マスのピースの時にtrueを返す
    checkIfTheLastPieceHasOnlyOneCell(currentPlayerId) {
        let remainingPieces = this.players[currentPlayerId].remainingPieces;

        let remainingPiecesCounter = 0;
        for (const remainingPiece of Object.values(remainingPieces)) {
            if (remainingPiece.isUsed === false) remainingPiecesCounter++;
        }
        return remainingPiecesCounter === 1 && !remainingPieces[0].isUsed; // remainingPieces[0]は１マスのピース
    }
}
