<template>
  <div class="q-pa-md doc-container">
    <!-- Left  -->
    <div class="row" style="height: 400px">
      <div class="col">
        <div class="row items-start bg-red-3" style="height: 200px">
          <div class="col">
            left top
            <q-card-section>
              <q-select v-model="selectedShape" :options="shapes" label="Choose shape" />
            </q-card-section>
          </div>
        </div>
        <div class="row items-end bg-green-3" style="height: 200px">
          <div class="col">left bottom</div>
        </div>
      </div>

      <!-- Main  -->
      <div class="col-6 board">
        <div v-for="n of 20" :key="n">
          <div class="flex justify-between">
            <div
              v-for="m of 20"
              :key="m"
              class="square cursor-pointer"
              :class="bgColorClasses[board[n - 1][m - 1]]"
              @click="
                putShape(n, m, currentPlayerId);
                changePlayer(currentPlayerId);
              "
            >
              {{ board[n - 1][m - 1] }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right  -->
      <div class="col bg-green-3">
        <div class="row items-start bg-yellow-3" style="height: 200px">
          <div class="col">right top</div>
        </div>
        <div class="row items-end bg-blue-3" style="height: 200px">
          <div class="col">right bottom</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      bgColorClasses: [
        "bg-gray",
        "bg-pale-red",
        "bg-pale-green",
        "bg-pale-yellow",
        "bg-pale-blue",
      ],
      currentPlayerId: 1,
      shapes: [
        "i1",
        "i2",
        "i3",
        "v3",
        "i4",
        "j4",
        "square",
        // "z4",
        // "t4",
        // "c",
        // "w",
        // "i5",
        // "j5",
        // "t5",
        // "v5",
        // "x",
        // "k5",
        // "z5",
        // "z5wide",
        // "p",
        // "y",
      ],
      selectedShape: "",
    };
  },
  methods: {
    changePlayer: function (currentPlayerId) {
      if (currentPlayerId === 4) this.currentPlayerId = 1;
      if (currentPlayerId !== 4) this.currentPlayerId += 1;
    },
    putShape: function (n, m, currentPlayerId) {
      console.log(this.selectedShape);
      switch (this.selectedShape) {
        case "i1":
          this.putI1(n, m, currentPlayerId);
          break;
        case "i2":
          this.putI2(n, m, currentPlayerId);
          break;
        case "i3":
          this.putI3(n, m, currentPlayerId);
          break;
        case "v3":
          this.putV3(n, m, currentPlayerId);
          break;
        case "i4":
          this.putI4(n, m, currentPlayerId);
          break;
        case "j4":
          this.putj4(n, m, currentPlayerId);
          break;
        case "square":
          this.putSquare(n, m, currentPlayerId);
          break;
      }
    },
    putI1: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
    },
    putI2: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
      this.board[n - 2].splice(m - 1, 1, currentPlayerId);
    },
    putI3: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
      this.board[n - 2].splice(m - 1, 1, currentPlayerId);
      this.board[n - 3].splice(m - 1, 1, currentPlayerId);
    },
    putV3: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
      this.board[n - 2].splice(m - 1, 1, currentPlayerId);
      this.board[n - 1].splice(m - 2, 1, currentPlayerId);
    },
    putI4: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
      this.board[n - 2].splice(m - 1, 1, currentPlayerId);
      this.board[n - 3].splice(m - 1, 1, currentPlayerId);
      this.board[n - 4].splice(m - 1, 1, currentPlayerId);
    },
    putJ4: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
      this.board[n - 1].splice(m - 2, 1, currentPlayerId);
      this.board[n - 1].splice(m - 3, 1, currentPlayerId);
      this.board[n - 2].splice(m - 3, 1, currentPlayerId);
    },
    putSquare: function (n, m, currentPlayerId) {
      this.board[n - 1].splice(m - 1, 1, currentPlayerId);
      this.board[n - 2].splice(m - 1, 1, currentPlayerId);
      this.board[n - 2].splice(m - 2, 1, currentPlayerId);
      this.board[n - 1].splice(m - 2, 1, currentPlayerId);
    },
  },
};
</script>

<style>
.square {
  height: 35px;
  width: 35px;
  padding: 0.2rm;
  border: 2px solid white;
  border-radius: 4px;
}
.bg-gray {
  background-color: rgb(225, 225, 225);
}
.bg-pale-red {
  background-color: #ef9a9a;
}
.bg-pale-green {
  background-color: #a5d6a7;
}
.bg-pale-yellow {
  background-color: #fff59d;
}
.bg-pale-blue {
  background-color: #90caf9;
}
</style>
