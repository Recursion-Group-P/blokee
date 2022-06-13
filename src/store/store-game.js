import { Player, AIPlayer } from 'src/model/player';
import { PLAYER_COLORS } from 'src/constants';
import { Platform } from 'quasar';

const state = {
  numberOfPlayers: 2,
  timeForEachPlayer: 600, // 600 = 10mins
  startPosition: 'Corner', // ["Center", "Corner", "Anywhere"]
  boardSettings: {
    // window.innerWidth > 1180 -> laptop
    // window.innerWidth < 768 -> mobile
    // else -> tablet
    width: window.innerWidth > 1180 ? 490 : window.innerWidth < 768 ? 364 : 420,
    height: window.innerWidth > 1180 ? 490 : window.innerWidth < 768 ? 364 : 420,
    totalCells: 14,
    cellWidth: window.innerWidth > 1180 ? 35 : window.innerWidth < 768 ? 26 : 30,
    startingPositions: [
      [0, 0],
      [13, 13],
    ],
  },
  currentPlayerId: 0,
  currPiecePoint: 0,
  players: [new Player(PLAYER_COLORS[0], 'YOU'), new AIPlayer(PLAYER_COLORS[1], 'CPU 1', 14)],
  replay: {
    boardStates: [new Array(14).fill(0).map(() => new Array(14).fill(0))],
    usedPieces: [], // usedPieces[i] = used piece index for that player turn, where i = ith turn
    players: [new Player(PLAYER_COLORS[0], 'YOU'), new AIPlayer(PLAYER_COLORS[1], 'CPU 1', 14)],
  },
  winnerExist: false, // ゲーム終了時にtrueに変更
  // gameJudge: 0,
};

const mutations = {
  setGameSettings(state, payload) {
    state.numberOfPlayers = payload.numberOfPlayers;
    state.timeForEachPlayer = payload.timeForEachPlayer;
  },

  setBoardSettings(state, payload) {
    state.boardSettings = {
      width: payload.width,
      height: payload.height,
      totalCells: payload.totalCells,
      cellWidth: payload.cellWidth,
      startingPositions: payload.startingPositions,
    };
  },

  setPlayers(state, payload) {
    state.players = payload;
  },

  setCurrentPlayerSelectedPieceId(state, payload) {
    state.players[payload.currentPlayerId].selectedPieceId = parseInt(payload.selectedPieceId);
  },

  updateCurrentPlayerRemainingPieces(state, payload) {
    const currPlayer = state.players[payload.currentPlayerId];
    currPlayer.remainingPieces[currPlayer.selectedPieceId].isUsed = true;
  },

  updateCurrentPieceCoordinateAfterFlip(state, payload) {
    const currPlayer = state.players[payload.currentPlayerId];
    let pieceCoordinate = currPlayer.remainingPieces[payload.currentPiece].pieceCoords;

    // フリップ(左右反転)：Y座標は不変、X座標を+/-反対にする
    for (let i = 0; i < pieceCoordinate.length; i++) {
      pieceCoordinate[i].splice(1, 1, -pieceCoordinate[i][1]);
    }
  },

  updateCurrentPieceCoordinateAfterRotation(state, payload) {
    const currPlayer = state.players[payload.currentPlayerId];
    let pieceCoordinate = currPlayer.remainingPieces[payload.currentPiece].pieceCoords;

    if (payload['rotateDirection'] === 'cw') {
      for (let j = 0; j < pieceCoordinate.length; j++) {
        pieceCoordinate[j].splice(0, 1, -pieceCoordinate[j][0]);
        let temp = pieceCoordinate[j][0];
        pieceCoordinate[j].splice(0, 1, pieceCoordinate[j][1]);
        pieceCoordinate[j].splice(1, 1, temp);
      }
    }
    if (payload['rotateDirection'] === 'ccw') {
      for (let j = 0; j < pieceCoordinate.length; j++) {
        pieceCoordinate[j].splice(1, 1, -pieceCoordinate[j][1]);
        let temp = pieceCoordinate[j][1];
        pieceCoordinate[j].splice(1, 1, pieceCoordinate[j][0]);
        pieceCoordinate[j].splice(0, 1, temp);
      }
    }
  },

  setReplayState(state, payload) {
    state.replay.boardStates = [payload.boardState];
    state.replay.usedPieces = payload.usedPiece;
    state.replay.players = payload.players;
  },

  addReplayState(state, payload) {
    state.replay.boardStates.push(payload.boardState);
    state.replay.usedPieces.push(payload.usedPiece);
  },

  updateReplayCurrentPlayerRemainingPieces(state, payload) {
    const currPlayer = state.replay.players[payload.currentPlayerId];
    currPlayer.remainingPieces[payload.usedPieceId].isUsed = payload.isUsed;
  },

  updateCurrentPlayerId(state, payload) {
    // state.winnerExist = new Evaluation(state.players, payload.gameOverCount).checkWinner();
    // if (state.winnerExist) return;
    state.currentPlayerId = payload['nextPlayerId'];
  },

  updatePlayerOutOfGame(state, payload) {
    console.log('before: ' + state.players[payload['currentPlayerId']].outOfGame);
    state.players[payload['currentPlayerId']].outOfGame = true;
    // state.gameJudge++
    console.log('after: ' + state.players[payload['currentPlayerId']].outOfGame);
  },

  updateCurrentPlayerScore(state, payload) {
    console.log(payload);
    state.players[payload['currentPlayerId']].score += payload['currPiecePoint'];
  },
};

const actions = {
  setGameSettings({ commit }, { numberOfPlayers, timeForEachPlayer, startPosition }) {
    // console.log(timeForEachPlayer);
    if (numberOfPlayers == 2) {
      let startingPositions = null;
      if (startPosition == 'Corner')
        startingPositions = [
          [0, 0],
          [13, 13],
        ];
      const payload = {
        width: window.innerWidth > 1180 ? 490 : window.innerWidth < 768 ? 364 : 420,
        height: window.innerWidth > 1180 ? 490 : window.innerWidth < 768 ? 364 : 420,
        totalCells: 14,
        cellWidth: window.innerWidth > 1180 ? 35 : window.innerWidth < 768 ? 26 : 30,
        startingPositions,
      };
      commit('setBoardSettings', payload);
      commit('setPlayers', [
        new Player(PLAYER_COLORS[0], 'YOU'),
        new AIPlayer(PLAYER_COLORS[1], 'CPU 1', 14),
      ]);
      commit('setReplayState', {
        boardState: new Array(14).fill(0).map(() => new Array(14).fill(0)),
        usedPiece: [],
        players: [new Player(PLAYER_COLORS[0], 'YOU'), new AIPlayer(PLAYER_COLORS[1], 'CPU 1', 14)],
      });
    } else if (numberOfPlayers == 4) {
      let startingPositions = null;
      if (startPosition == 'Corner')
        startingPositions = [
          [0, 0],
          [0, 19],
          [19, 0],
          [19, 19],
        ];
      const payload = {
        width: window.innerWidth > 1180 ? 600 : window.innerWidth < 768 ? 380 : 500,
        height: window.innerWidth > 1180 ? 600 : window.innerWidth < 768 ? 380 : 500,
        totalCells: 20,
        cellWidth: window.innerWidth > 1180 ? 30 : window.innerWidth < 768 ? 19 : 25,
        startingPositions,
      };
      commit('setBoardSettings', payload);
      commit('setPlayers', [
        new Player(PLAYER_COLORS[0], 'YOU'),
        new AIPlayer(PLAYER_COLORS[1], 'CPU 1', 20),
        new AIPlayer(PLAYER_COLORS[2], 'CPU 2', 20),
        new AIPlayer(PLAYER_COLORS[3], 'CPU 3', 20),
      ]);
      commit('setReplayState', {
        boardState: new Array(20).fill(0).map(() => new Array(20).fill(0)),
        usedPiece: [],
        players: [
          new Player(PLAYER_COLORS[0], 'YOU'),
          new AIPlayer(PLAYER_COLORS[1], 'CPU 1', 20),
          new AIPlayer(PLAYER_COLORS[2], 'CPU 2', 20),
          new AIPlayer(PLAYER_COLORS[3], 'CPU 3', 20),
        ],
      });
    }
    commit('setGameSettings', {
      currentPlayerId: 0,
      numberOfPlayers: numberOfPlayers,
      timeForEachPlayer: timeForEachPlayer,
    });
  },

  setCurrentPlayerSelectedPieceId({ commit }, { currentPlayerId, selectedPieceId }) {
    commit('setCurrentPlayerSelectedPieceId', { currentPlayerId, selectedPieceId });
  },

  updateCurrentPlayerRemainingPieces({ commit }, { currentPlayerId }) {
    commit('updateCurrentPlayerRemainingPieces', { currentPlayerId });
  },

  updateCurrentPieceCoordinateAfterFlip({ commit }, { currentPlayerId, currentPiece }) {
    commit('updateCurrentPieceCoordinateAfterFlip', { currentPlayerId, currentPiece });
  },

  updateCurrentPieceCoordinateAfterRotation(
    { commit },
    { currentPlayerId, rotateDirection, currentPiece }
  ) {
    commit('updateCurrentPieceCoordinateAfterRotation', {
      currentPlayerId,
      rotateDirection,
      currentPiece,
    });
  },

  addReplayState({ commit }, { boardState, usedPiece }) {
    commit('addReplayState', { boardState, usedPiece });
  },

  updateReplayCurrentPlayerRemainingPieces({ commit }, { currentPlayerId, usedPieceId, isUsed }) {
    commit('updateReplayCurrentPlayerRemainingPieces', {
      currentPlayerId,
      usedPieceId,
      isUsed,
    });
  },

  updateCurrentPlayerId({ commit }) {
    let nextPlayerId = (state.currentPlayerId + 1) % state.players.length;
    let gameOverPlayerCount = 0; // playerのoutOfGameを確認した回数をカウント
    while (state.players[nextPlayerId].outOfGame) {
      // 確認した回数とplayer数が同じなったらループ終了
      gameOverPlayerCount++;
      if (gameOverPlayerCount == state.players.length) {
        break;
      }

      nextPlayerId++;
      // playerの数を超えたら0に戻す
      if (nextPlayerId > state.players.length - 1) nextPlayerId = 0;
    }

    commit('updateCurrentPlayerId', { nextPlayerId });
  },

  updatePlayerOutOfGame({ commit }, { currentPlayerId }) {
    commit('updatePlayerOutOfGame', { currentPlayerId });
  },

  updateCurrentPlayerScore({ commit }, { currentPlayerId, currPiecePoint }) {
    commit('updateCurrentPlayerScore', { currentPlayerId, currPiecePoint });
  },
};

const getters = {
  numberOfPlayers(state) {
    return state.numberOfPlayers;
  },

  timeForEachPlayer(state) {
    return state.timeForEachPlayer;
  },

  startPosition(state) {
    return state.startPosition;
  },

  boardSettings(state) {
    return state.boardSettings;
  },

  players(state) {
    return state.players;
  },

  replay(state) {
    return state.replay;
  },

  currentPlayerId(state) {
    return state.currentPlayerId;
  },

  winnerExist(state) {
    return state.winnerExist;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
