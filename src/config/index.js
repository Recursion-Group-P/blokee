export const Config = {
    numberOfPlayers: 2,
    numberOfPlayersOptions: [2, 4],
    numberOfCPU: 0,
    numberOfCPUOptions: {
      "2":[0, 1, 2],
      "4":[0, 1, 2, 3, 4],
    },
    CPUStrength:["easy", "easy", "easy", "easy"],
    CPUStrengthOptions:["easy", "medium", "hard"],
    timeForEachPlayer: { label: "10 min", value: 600 },
    timeForEachPlayerOptions: [
        { label: "5 min", value: 300 },
        { label: "10 min", value: 600 },
        { label: "20 min", value: 1200 },
    ],
    startPosition: "Corner",
    startPositionOptions: ["Center", "Corner", "Anywhere"],
};
