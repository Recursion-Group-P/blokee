<template>
    <div class="rounded-borders q-pa-sm" style="background-color: #f2f4f7">
        <canvas
            v-for="pieceId in currPlayerRemainingPieces"
            :key="pieceId"
            :ref="'canvas' + pieceId"
            class="cursor-pointer"
            style="width: 20%"
            height="250px"
            @click="selectPiece(pieceId)"
        ></canvas>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['playerId'],
    mounted() {
        const pieceCoordinates = this.players[this.playerId].remainingPieces;
        for (const pieceId of this.currPlayerRemainingPieces) {
            this.drawPiece('canvas' + pieceId, pieceCoordinates[pieceId].pieceCoords);
        }
    },
    data() {
        return {
            cellSize: 50,
            startDrawCoordinate: { x: 100, y: 100 },
        };
    },
    computed: {
        ...mapGetters('game', ['players']),

        currPlayerRemainingPieces() {
            const remainingPieces = this.players[this.playerId].remainingPieces;
            return Object.keys(remainingPieces).reduce((filtered, pieceId) => {
                if (!remainingPieces[pieceId].isUsed) {
                    filtered.push(parseInt(pieceId));
                }
                return filtered;
            }, []);
        },
    },
    methods: {
        ...mapActions('game', ['setCurrentPlayerSelectedPieceId']),

        // for pieces
        drawPiece(canvasId, pieceCoordinate) {
            let canvas = this.$refs[canvasId][0];
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = this.players[this.playerId].color;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;

            // Draw center piece
            ctx.fillRect(
                this.startDrawCoordinate['x'],
                this.startDrawCoordinate['y'],
                this.cellSize,
                this.cellSize
            );
            ctx.strokeRect(
                this.startDrawCoordinate['x'],
                this.startDrawCoordinate['y'],
                this.cellSize,
                this.cellSize
            );

            // Draw other piece
            for (let i = 0; i < pieceCoordinate.length; i++) {
                ctx.fillRect(
                    pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate['x'],
                    pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate['y'],
                    this.cellSize,
                    this.cellSize
                );
                ctx.strokeRect(
                    pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate['x'],
                    pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate['y'],
                    this.cellSize,
                    this.cellSize
                );
            }
        },
        selectPiece(pieceId) {
            this.setCurrentPlayerSelectedPieceId({
                currentPlayerId: this.playerId,
                selectedPieceId: pieceId,
            });
        },
    },
};
</script>
