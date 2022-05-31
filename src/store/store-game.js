const state = {
  numberOfPlayers: 2,
  timeForEachPlayer: "10 min",  // ["5 min", "10 min", "20 min"]
  startPosition: "Corner",  // ["Center", "Corner", "Anywhere"]
  boardSettings: {
    width: 300,
    height: 300,
    totalCells: 14,
    cellWidth: 20,
  },
  currentPlayerIndex:0,
}

const mutations = {
    setGameSettings(state, payload) {
      state.numberOfPlayers = payload.numberOfPlayers
      state.timeForEachPlayer = payload.timeForEachPlayer
      state.startPosition = payload.startPosition
    },
    setBoardSettings(state, payload){
      state.boardSettings = {
        width: payload.width,
        height: payload.height,
        totalCells: payload.totalCells,
        cellWidth: payload.cellWidth
      }
    },
}

const actions = {
    setGameSettings({commit}, { numberOfPlayers, timeForEachPlayer, startPosition }){
        if(numberOfPlayers == 2){
            const payload = {
                width: 420,
                height: 420,
                totalCells: 14,
                cellWidth: 30,
            }
            commit('setBoardSettings', payload)
        }
        else if(numberOfPlayers == 4){
            const payload = {
                width: 300,
                height: 300,
                totalCells:20,
                cellWidth:15,
            }
            commit('setBoardSettings', payload)
        }
        commit('setGameSettings', { numberOfPlayers: numberOfPlayers, timeForEachPlayer: timeForEachPlayer, startPosition: startPosition});
    }
}

const getters = {
    numberOfPlayers(state) {
      return state.numberOfPlayers
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
    currentPlayerIndex(state) {
        return state.currentPlayerIndex;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
