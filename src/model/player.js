import { getAllPieces, PIECES } from './piece';

export class Player {
  constructor(color, name, isAI = false) {
    this.name = name;
    this.score = -89;
    this.color = color;
    this.remainingPieces = getAllPieces(PIECES);
    this.selectedPieceId = -1;
    this.outOfGame = false;
    this.isAI = isAI;
  }
}

export class AIPlayer extends Player {
  constructor(color, name, isAI = true) {
    super(color, name, isAI)
  }

  // AI methods をこっちに移動？
}