import { Player } from "src/model/Player";
import { PLAYER_COLORS } from "src/constants";

const state = {
  numberOfPlayers: 2,
  timeForEachPlayer: 600, // 600 = 10mins
  startPosition: "Corner", // ["Center", "Corner", "Anywhere"]
  boardSettings: {
    width: 420,
    height: 420,
    totalCells: 14,
    cellWidth: 30,
    startingPositions: [
      [0, 0],
      [13, 13],
    ],
  },
  // currentPlayerId: 0,
  players: [new Player(PLAYER_COLORS[0], 600), new Player(PLAYER_COLORS[1], 600)],
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
    state.players[payload.currentPlayerId].selectedPieceId = parseInt(
      payload.selectedPieceId
    );
  },

  updateCurrentPlayerRemainingPieces(state, payload) {
    const currPlayer = state.players[payload.currentPlayerId];
    currPlayer.remainingPieces.splice(currPlayer.selectedPieceId, 1);
  },

  updateCurrentPieceCoordinate(state, payload) {
    const currPlayer = state.players[payload.currentPlayerId];
    let pieceCoordinate = currPlayer.remainingPieces[payload.currentPiece];
    if (payload["isFlipped"] === true) {
      // フリップ(左右反転)：Y座標は不変、X座標を+/-反対にする
      for (let i = 0; i < pieceCoordinate.length; i++) {
        if (payload["currentDegree"] === 0 || payload["currentDegree"] === 180)
          pieceCoordinate[i].splice(1, 1, -pieceCoordinate[i][1]);
        if (payload["currentDegree"] === 90 || payload["currentDegree"] === 270)
          pieceCoordinate[i].splice(0, 1, -pieceCoordinate[i][0]);
      }
    }
    if (payload["currentDegree"] !== 0) {
      // 右90度回転：Y座標を+/-反対にし、その後Y座標の値とX座標の値を入れ替える（※左90度回転 = 右270度回転）
      let timesOfRotation = payload["currentDegree"] / 90;
      for (let i = 0; i < timesOfRotation; i++) {
        for (let j = 0; j < pieceCoordinate.length; j++) {
          pieceCoordinate[j].splice(0, 1, -pieceCoordinate[j][0]);
          let temp = pieceCoordinate[j][0];
          pieceCoordinate[j].splice(0, 1, pieceCoordinate[j][1]);
          pieceCoordinate[j].splice(1, 1, temp);
        }
      }
    }
  },

  updatePlayerScore(state, payload) {
    state.players[payload["currentPlayerId"]].score += payload["numOfPieceCells"];
  },

  updatePlayerOutOfGame(state, payload) {
    console.log("before: " + state.players[payload["currentPlayerId"]].outOfGame);
    state.players[payload["currentPlayerId"]].outOfGame = true;
    console.log("after: " + state.players[payload["currentPlayerId"]].outOfGame);
  },
};

const actions = {
  setGameSettings({ commit }, { numberOfPlayers, timeForEachPlayer, startPosition }) {
    if (numberOfPlayers == 2) {
      let startingPositions = null;
      if (startPosition == "Corner")
        startingPositions = [
          [0, 0],
          [13, 13],
        ];
      const payload = {
        width: 420,
        height: 420,
        totalCells: 14,
        cellWidth: 30,
        startingPositions,
      };
      commit("setBoardSettings", payload);
      commit("setPlayers", [
        new Player(PLAYER_COLORS[0], timeForEachPlayer),
        new Player(PLAYER_COLORS[1], timeForEachPlayer),
      ]);
    } else if (numberOfPlayers == 4) {
      let startingPositions = null;
      if (startPosition == "Corner")
        startingPositions = [
          [0, 0],
          [0, 19],
          [19, 0],
          [19, 19],
        ];
      const payload = {
        width: 420,
        height: 420,
        totalCells: 20,
        cellWidth: 21,
        startingPositions,
      };
      commit("setBoardSettings", payload);
      commit("setPlayers", [
        new Player(PLAYER_COLORS[0], timeForEachPlayer),
        new Player(PLAYER_COLORS[1], timeForEachPlayer),
        new Player(PLAYER_COLORS[2], timeForEachPlayer),
        new Player(PLAYER_COLORS[3], timeForEachPlayer),
      ]);
    }
    commit("setGameSettings", {
      numberOfPlayers: numberOfPlayers,
      timeForEachPlayer: timeForEachPlayer,
    });
  },

  setCurrentPlayerSelectedPieceId({ commit }, { currentPlayerId, selectedPieceId }) {
    commit("setCurrentPlayerSelectedPieceId", { currentPlayerId, selectedPieceId });
  },

  updateCurrentPlayerRemainingPieces({ commit }, { currentPlayerId }) {
    commit("setCurrentPlayerRemainingPieces", { currentPlayerId });
  },

  updateCurrentPieceCoordinate(
    { commit },
    { currentPlayerId, isFlipped, currentDegree, currentPiece }
  ) {
    commit("updateCurrentPieceCoordinate", {
      currentPlayerId,
      isFlipped,
      currentDegree,
      currentPiece,
    });
  },

  updatePlayerScore({ commit }, { currentPlayerId, numOfPieceCells }) {
    commit("updatePlayerScore", { currentPlayerId, numOfPieceCells });
  },

  updatePlayerOutOfGame({ commit }, { currentPlayerId }) {
    commit("updatePlayerOutOfGame", { currentPlayerId });
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
