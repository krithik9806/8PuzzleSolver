const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// Solvability check for 3x3 puzzle
// A puzzle is solvable if the number of inversions is even.
function isSolvable(state) {
  let inversions = 0;
  for (let i = 0; i < state.length - 1; i++) {
    for (let j = i + 1; j < state.length; j++) {
      if (state[i] !== 0 && state[j] !== 0 && state[i] > state[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

// Get the coordinates (x,y) from a 1D index
function getCoords(index) {
  return { x: index % 3, y: Math.floor(index / 3) };
}

// Heuristic 1: Manhattan Distance
function getManhattanDistance(state) {
  let dist = 0;
  for (let i = 0; i < state.length; i++) {
    const val = state[i];
    if (val !== 0) {
      const idx = val - 1; // Goal index for value `val` (1 is at 0, 8 is at 7)
      const currentCoords = getCoords(i);
      const goalCoords = getCoords(idx);
      dist += Math.abs(currentCoords.x - goalCoords.x) + Math.abs(currentCoords.y - goalCoords.y);
    }
  }
  return dist;
}

// Heuristic 2: Misplaced Tiles
function getMisplacedTiles(state) {
  let count = 0;
  for (let i = 0; i < state.length; i++) {
    const val = state[i];
    if (val !== 0 && val !== GOAL_STATE[i]) {
      count++;
    }
  }
  return count;
}

function getNeighbors(state) {
  const neighbors = [];
  const zeroIndex = state.indexOf(0);
  const { x, y } = getCoords(zeroIndex);
  
  const moves = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }   // Right
  ];

  for (const move of moves) {
    const nx = x + move.dx;
    const ny = y + move.dy;
    if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) {
      const nIndex = ny * 3 + nx;
      const newState = [...state];
      // Swap zero with the neighbor
      newState[zeroIndex] = newState[nIndex];
      newState[nIndex] = 0;
      neighbors.push(newState);
    }
  }
  return neighbors;
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(element, priority) {
    this.heap.push({ element, priority });
    let idx = this.heap.length - 1;
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[parentIdx].priority <= this.heap[idx].priority) break;
      const tmp = this.heap[idx];
      this.heap[idx] = this.heap[parentIdx];
      this.heap[parentIdx] = tmp;
      idx = parentIdx;
    }
  }

  dequeue() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      let idx = 0;
      const length = this.heap.length;
      while (true) {
        let leftChildIdx = 2 * idx + 1;
        let rightChildIdx = 2 * idx + 2;
        let swap = null;

        if (leftChildIdx < length) {
          if (this.heap[leftChildIdx].priority < this.heap[idx].priority) {
            swap = leftChildIdx;
          }
        }
        if (rightChildIdx < length) {
          if (
            (swap === null && this.heap[rightChildIdx].priority < this.heap[idx].priority) ||
            (swap !== null && this.heap[rightChildIdx].priority < this.heap[leftChildIdx].priority)
          ) {
            swap = rightChildIdx;
          }
        }
        if (swap === null) break;
        const tmp = this.heap[idx];
        this.heap[idx] = this.heap[swap];
        this.heap[swap] = tmp;
        idx = swap;
      }
    }
    return min ? min.element : null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

// A* Search
function solvePuzzle(initialState, heuristicType = 'manhattan') {
  if (!isSolvable(initialState)) {
    return { error: 'Puzzle is unsolvable' };
  }

  const startTime = Date.now();
  const queue = new PriorityQueue();
  const closedSet = new Set();
  
  // Custom simple node structure
  const startNode = {
    state: initialState,
    path: [initialState],
    g: 0,
    h: heuristicType === 'manhattan' ? getManhattanDistance(initialState) : getMisplacedTiles(initialState)
  };
  startNode.f = startNode.g + startNode.h;

  queue.enqueue(startNode, startNode.f);
  
  const stateToString = (s) => s.join(',');
  let nodesExplored = 0;

  const goalStr = stateToString(GOAL_STATE);
  // Keep track of best g scores to prevent reopening nodes with worse scores
  const gScores = new Map();
  gScores.set(stateToString(initialState), 0);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    nodesExplored++;
    
    // Check timeout to prevent infinite loops (prevent server crash)
    if (Date.now() - startTime > 10000) {
      return { error: 'Solver timed out (10s)' };
    }

    const currentStr = stateToString(current.state);
    
    if (currentStr === goalStr) {
      return {
        solution: current.path,
        moves: current.g,
        timeTakenMs: Date.now() - startTime,
        nodesExplored
      };
    }

    closedSet.add(currentStr);

    const neighbors = getNeighbors(current.state);
    for (const neighborState of neighbors) {
      const neighborStr = stateToString(neighborState);
      if (closedSet.has(neighborStr)) continue;

      const tentativeG = current.g + 1;
      const h = heuristicType === 'manhattan' ? getManhattanDistance(neighborState) : getMisplacedTiles(neighborState);
      
      const existingG = gScores.get(neighborStr);
      if (existingG === undefined || tentativeG < existingG) {
        gScores.set(neighborStr, tentativeG);
        const neighborNode = {
          state: neighborState,
          path: [...current.path, neighborState],
          g: tentativeG,
          h: h,
          f: tentativeG + h
        };
        queue.enqueue(neighborNode, neighborNode.f);
      }
    }
  }

  return { error: 'No solution found' };
}

module.exports = {
  solvePuzzle,
  isSolvable,
  GOAL_STATE
};
