const { solvePuzzle, isSolvable } = require('./solver');

const state = [2, 8, 3, 1, 6, 4, 7, 0, 5]; // A solvable state
console.log("Solvable?", isSolvable(state));
const res = solvePuzzle(state, 'manhattan');
console.log("Moves:", res.moves, "Time:", res.timeTakenMs, "Nodes:", res.nodesExplored);
if (res.error) console.error(res.error);
