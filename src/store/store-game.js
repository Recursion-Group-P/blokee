import { Player } from "src/model/Player";
import { PLAYER_COLORS } from "src/constants";
import { confirmPasswordReset } from "firebase/auth";

const state = {
  numberOfPlayers: 2,
  timeForEachPlayer: "10 min", // ["5 min", "10 min", "20 min"]
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
  currentPlayerIndex: 0,
  players: [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])],
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
  updatePieceCoordinate(state, payload) {
    let pieceCoordinate =
      state.players[payload["playerId"]].remainingPieces[payload["selectedPieceId"]];
    if (payload["isFlipped"] === true) {
      // フリップ(左右反転)：Y座標は不変、X座標を+/-反対にする
      for (let i = 0; i < pieceCoordinate.length; i++) {
        if (payload["currentDegree"] === 0 || payload["currentDegree"] === 180) pieceCoordinate[i].splice(1, 1, -pieceCoordinate[i][1]);
        if (payload["currentDegree"] === 90 || payload["currentDegree"] === 270) pieceCoordinate[i].splice(0, 1, -pieceCoordinate[i][0]);
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
    console.log(state.players[0].remainingPieces);
    console.log(state.players[1].remainingPieces);
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
      commit("setPlayers", [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])]);
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
        new Player(PLAYER_COLORS[0]),
        new Player(PLAYER_COLORS[1]),
        new Player(PLAYER_COLORS[2]),
        new Player(PLAYER_COLORS[3]),
      ]);
    }
    commit("setGameSettings", {
      numberOfPlayers: numberOfPlayers,
      timeForEachPlayer: timeForEachPlayer,
    });
  },
  updatePieceCoordinate({ commit }, payload) {
    commit("updatePieceCoordinate", payload);
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
