import { Player } from 'src/model/Player';
import { PLAYER_COLORS } from 'src/constants';

const state = {
  numberOfPlayers: 2,
  timeForEachPlayer: '10 min', // ["5 min", "10 min", "20 min"]
  startPosition: 'Corner', // ["Center", "Corner", "Anywhere"]
  boardSettings: {
    width: 490,
    height: 490,
    totalCells: 14,
    cellWidth: 35,
    startingPositions: [
      [0, 0],
      [13, 13],
    ],
  },
  currentPlayerIndex: 0,
  players: [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])],
  replay: {
    boardStates: [new Array(14).fill(0).map(() => new Array(14).fill(0))],
    usedPieces: [], // usedPieces[i] = used piece index for that player turn, where i = ith turn
    players: [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])],
  },
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
};

const actions = {
  setGameSettings({ commit }, { numberOfPlayers, timeForEachPlayer, startPosition }) {
    if (numberOfPlayers == 2) {
      let startingPositions = null;
      if (startPosition == 'Corner')
        startingPositions = [
          [0, 0],
          [13, 13],
        ];
      const payload = {
        width: 490,
        height: 490,
        totalCells: 14,
        cellWidth: 35,
        startingPositions,
      };
      commit('setBoardSettings', payload);
      commit('setPlayers', [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])]);
      commit('setReplayState', {
        boardState: new Array(14).fill(0).map(() => new Array(14).fill(0)),
        usedPiece: [],
        players: [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])],
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
        width: 600,
        height: 600,
        totalCells: 20,
        cellWidth: 30,
        startingPositions,
      };
      commit('setBoardSettings', payload);
      commit('setPlayers', [
        new Player(PLAYER_COLORS[0]),
        new Player(PLAYER_COLORS[1]),
        new Player(PLAYER_COLORS[2]),
        new Player(PLAYER_COLORS[3]),
      ]);
      commit('setReplayState', {
        boardState: new Array(20).fill(0).map(() => new Array(20).fill(0)),
        usedPiece: [],
        players: [
          new Player(PLAYER_COLORS[0]),
          new Player(PLAYER_COLORS[1]),
          new Player(PLAYER_COLORS[2]),
          new Player(PLAYER_COLORS[3]),
        ],
      });
    }
    commit('setGameSettings', {
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
    commit('updateReplayCurrentPlayerRemainingPieces', { currentPlayerId, usedPieceId, isUsed });
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
