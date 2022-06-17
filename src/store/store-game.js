import { Player, RandomAIPlayer, MediumRandomAIPlayer, GreedyAIPlayer } from 'src/model/player';
import { PLAYER_COLORS } from 'src/constants';
import { Platform } from 'quasar';
import { Evaluation } from 'src/model/evaluation';

const EASY_NAMES = ['BOB 👶', 'MARIA 🐤', 'JOHN 🐇', 'KATE 🧸'].sort(() => Math.random() - 0.5);
const MEDIUM_NAMES = ['KWON 😎', 'HIROTADA 😊', 'HIROTO 🌚', 'HAYATO 🌝'].sort(
  () => Math.random() - 0.5
);
const HARD_NAMES = [
  'BILL GATES 👹',
  'STEVE JOBS 👺',
  'ELON MUSK 🦖',
  'JEFF BEZOS 👽',
  'JEFFRY 👿',
  'SHINYA 🦁',
].sort(() => Math.random() - 0.5);

const state = {
  numberOfPlayers: 2,
  numberOfCPU: 0,
  CPUStrength: [],
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
  players: [
    new Player(PLAYER_COLORS[0], 'Player 1'),
    new GreedyAIPlayer(PLAYER_COLORS[1], HARD_NAMES[0], 14),
  ],
  replay: {
    boardStates: [new Array(14).fill(0).map(() => new Array(14).fill(0))],
    usedPieces: [], // usedPieces[i] = { playerId, usedPieceId }
    players: [
      new Player(PLAYER_COLORS[0], 'Player 1'),
      new GreedyAIPlayer(PLAYER_COLORS[1], HARD_NAMES[0], 14),
    ],
  },
  gameIsOver: false, // ゲームが終了したかどうか
};

const mutations = {
  setGameSettings(state, payload) {
    state.numberOfPlayers = payload.numberOfPlayers;
    state.timeForEachPlayer = payload.timeForEachPlayer;
    state.numberOfCPU = payload.numberOfCPU;
    state.CPUStrength = payload.CPUStrength;
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
    state.currentPlayerId = payload.nextPlayerId;
  },

  updatePlayerOutOfGame(state, payload) {
    state.players[payload.currentPlayerId].outOfGame = true;
  },

  updateCurrentPlayerScore(state, payload) {
    state.players[payload.currentPlayerId].score += payload.currPiecePoint;
  },

  updateGameIsOver(state, payload) {
    state.gameIsOver = payload;
  },

  // stateのデータを初期化
  formatState(state, payload) {
    Object.assign(state, payload);
  },

  recordRemainingTime(state, payload) {
    state.players[payload.currentPlayerId].remainingTime = payload.remainingTime;
  },
};

const actions = {
  setGameSettings(
    { commit },
    { numberOfPlayers, timeForEachPlayer, startPosition, numberOfCPU, CPUStrength, totalCells }
  ) {
    if (numberOfPlayers == 2) {
      let startingPositions = null;
      switch (startPosition) {
        case 'Corner':
          startingPositions = [
            [0, 0],
            [13, 13],
          ];
          break;

        case 'Center':
          startingPositions = [
            [4, 4],
            [9, 9],
          ];
          break;
      }

      const payload = {
        width: window.innerWidth > 1180 ? 490 : window.innerWidth < 768 ? 364 : 420,
        height: window.innerWidth > 1180 ? 490 : window.innerWidth < 768 ? 364 : 420,
        totalCells: totalCells,
        cellWidth: window.innerWidth > 1180 ? 35 : window.innerWidth < 768 ? 26 : 30,
        startingPositions,
      };
      commit('setBoardSettings', payload);
    } else if (numberOfPlayers == 4) {
      let startingPositions = null;
      switch (startPosition) {
        case 'Corner':
          startingPositions = [
            [0, 0],
            [0, 19],
            [19, 0],
            [19, 19],
          ];
          break;

        case 'Center':
          startingPositions = [
            [7, 7],
            [7, 12],
            [12, 7],
            [12, 12],
          ];
          break;
      }

      const payload = {
        width: window.innerWidth > 1180 ? 600 : window.innerWidth < 768 ? 380 : 500,
        height: window.innerWidth > 1180 ? 600 : window.innerWidth < 768 ? 380 : 500,
        totalCells: totalCells,
        cellWidth: window.innerWidth > 1180 ? 30 : window.innerWidth < 768 ? 19 : 25,
        startingPositions,
      };
      commit('setBoardSettings', payload);
    }

    let gameParticipant = [];
    let forReplayPlayer = [];

    EASY_NAMES.sort(() => Math.random() - 0.5);
    MEDIUM_NAMES.sort(() => Math.random() - 0.5);
    HARD_NAMES.sort(() => Math.random() - 0.5);

    let k = 0;
    for (let i = 0; i < numberOfPlayers - numberOfCPU; i++) {
      gameParticipant.push(new Player(PLAYER_COLORS[i], 'Player ' + (i + 1)));
      forReplayPlayer.push(new Player(PLAYER_COLORS[i], 'Player ' + (i + 1)));
      k++;
    }
    for (let j = 0; j < numberOfCPU; j++) {
      if (CPUStrength[j] === 'easy') {
        gameParticipant.push(new RandomAIPlayer(PLAYER_COLORS[k], EASY_NAMES[j], totalCells));
        forReplayPlayer.push(new RandomAIPlayer(PLAYER_COLORS[k], EASY_NAMES[j], totalCells));
      } else if (CPUStrength[j] === 'medium') {
        gameParticipant.push(
          new MediumRandomAIPlayer(PLAYER_COLORS[k], MEDIUM_NAMES[j], totalCells)
        );
        forReplayPlayer.push(
          new MediumRandomAIPlayer(PLAYER_COLORS[k], MEDIUM_NAMES[j], totalCells)
        );
      } else {
        gameParticipant.push(new GreedyAIPlayer(PLAYER_COLORS[k], HARD_NAMES[j], totalCells));
        forReplayPlayer.push(new GreedyAIPlayer(PLAYER_COLORS[k], HARD_NAMES[j], totalCells));
      }
      k++;
    }

    commit('setPlayers', gameParticipant);
    commit('setReplayState', {
      boardState: new Array(totalCells).fill(0).map(() => new Array(totalCells).fill(0)),
      usedPiece: [],
      players: forReplayPlayer,
    });

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

  updateGameIsOver({ commit }) {
    commit('updateGameIsOver', new Evaluation(state.players).checkIfGameIsOver());
  },

  // stateのデータを初期化する
  formatState({ commit }) {
    function getDefaultState() {
      return {
        numberOfPlayers: 2,
        numberOfCPU: 0,
        CPUStrength: [],
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
        players: [
          new Player(PLAYER_COLORS[0], 'Player 1'),
          new GreedyAIPlayer(PLAYER_COLORS[1], HARD_NAMES[0], 14),
        ],
        gameIsOver: false, // ゲームが終了したかどうか
      };
    }
    commit('formatState', getDefaultState());
  },

  recordRemainingTime({ commit }, { currentPlayerId, remainingTime }) {
    commit('recordRemainingTime', { currentPlayerId, remainingTime });
  },
};

const getters = {
  numberOfPlayers(state) {
    return state.numberOfPlayers;
  },

  numberOfCPU(state) {
    return state.numberOfCPU;
  },

  CPUStrength(state) {
    return state.CPUStrength;
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

  gameIsOver(state) {
    return state.gameIsOver;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
