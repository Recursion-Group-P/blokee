import { Player } from 'src/model/Player';
import { PLAYER_COLORS } from 'src/constants';

const state = {
  numberOfPlayers: 2,
  timeForEachPlayer: '10 min', // ["5 min", "10 min", "20 min"]
  startPosition: 'Corner', // ["Center", "Corner", "Anywhere"]
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
        width: 420,
        height: 420,
        totalCells: 14,
        cellWidth: 30,
        startingPositions,
      };
      commit('setBoardSettings', payload);
      commit('setPlayers', [new Player(PLAYER_COLORS[0]), new Player(PLAYER_COLORS[1])]);
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
        width: 420,
        height: 420,
        totalCells: 20,
        cellWidth: 21,
        startingPositions,
      };
      commit('setBoardSettings', payload);
      commit('setPlayers', [
        new Player(PLAYER_COLORS[0]),
        new Player(PLAYER_COLORS[1]),
        new Player(PLAYER_COLORS[2]),
        new Player(PLAYER_COLORS[3]),
      ]);
    }
    commit('setGameSettings', {
      numberOfPlayers: numberOfPlayers,
      timeForEachPlayer: timeForEachPlayer,
    });
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
