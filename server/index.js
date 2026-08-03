const express = require('express');
const cors = require('cors');
const { solvePuzzle, isSolvable } = require('./solver');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/solve', (req, res) => {
  const { initialState, heuristicType } = req.body;

  if (!initialState || !Array.isArray(initialState) || initialState.length !== 9) {
    return res.status(400).json({ error: 'Invalid puzzle state format. Expected an array of 9 numbers.' });
  }

  // Check if it contains exactly 0-8
  const sorted = [...initialState].sort((a, b) => a - b);
  for (let i = 0; i < 9; i++) {
    if (sorted[i] !== i) {
      return res.status(400).json({ error: 'Puzzle must contain numbers 0 to 8 without duplicates.' });
    }
  }

  if (!isSolvable(initialState)) {
    return res.status(400).json({ error: 'This puzzle configuration is unsolvable.' });
  }

  const result = solvePuzzle(initialState, heuristicType || 'manhattan');

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  return res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
