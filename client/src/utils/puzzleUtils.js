export const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function isSolvable(state) {
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

export function generateRandomSolvablePuzzle() {
  let state;
  do {
    state = [...GOAL_STATE].sort(() => Math.random() - 0.5);
  } while (!isSolvable(state));
  return state;
}

export function validatePuzzleInput(input) {
  const parts = input.split(',').map(s => s.trim());
  if (parts.length !== 9) return false;
  
  const nums = parts.map(p => parseInt(p, 10));
  if (nums.some(n => isNaN(n) || n < 0 || n > 8)) return false;
  
  const uniqueNums = new Set(nums);
  if (uniqueNums.size !== 9) return false;
  
  return nums;
}
