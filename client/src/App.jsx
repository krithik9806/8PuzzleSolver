import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Board from './components/Board';
import Controls from './components/Controls';
import Metrics from './components/Metrics';
import SolutionSteps from './components/SolutionSteps';
import { generateRandomSolvablePuzzle, validatePuzzleInput, GOAL_STATE } from './utils/puzzleUtils';

function App() {
  const [boardState, setBoardState] = useState(GOAL_STATE);
  const [manualInput, setManualInput] = useState(GOAL_STATE.join(', '));
  const [heuristic, setHeuristic] = useState('manhattan');
  const [speed, setSpeed] = useState(400);
  
  const [isSolving, setIsSolving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);
  
  // Metrics
  const [metrics, setMetrics] = useState({ moves: 0, time: 0, nodes: 0 });
  
  // Solution tracking
  const [solution, setSolution] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Use a ref to store the latest speed value for the animation loop
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const animationRef = useRef(null);

  useEffect(() => {
    // Initial shuffle
    handleShuffle();
  }, []);

  const handleShuffle = () => {
    const newPuzzle = generateRandomSolvablePuzzle();
    setBoardState(newPuzzle);
    setManualInput(newPuzzle.join(', '));
    resetSolutionState();
  };

  const handleManualSubmit = () => {
    const validated = validatePuzzleInput(manualInput);
    if (!validated) {
      setError('Invalid input. Must be 9 distinct numbers from 0 to 8.');
      return;
    }
    setBoardState(validated);
    setError(null);
    resetSolutionState();
  };

  const resetSolutionState = () => {
    setSolution(null);
    setCurrentStep(0);
    setMetrics({ moves: 0, time: 0, nodes: 0 });
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsAnimating(false);
    setIsSolving(false);
  };

  const handleReset = () => {
    resetSolutionState();
    setBoardState(GOAL_STATE);
    setManualInput(GOAL_STATE.join(', '));
  };

  const handleSolve = async () => {
    if (boardState.join(',') === GOAL_STATE.join(',')) {
      setError('Puzzle is already solved!');
      return;
    }

    setIsSolving(true);
    setError(null);
    resetSolutionState();

    try {
      const response = await fetch('http://localhost:3000/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialState: boardState,
          heuristicType: heuristic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to solve');
      }

      setSolution(data.solution);
      setMetrics({
        moves: data.moves,
        time: data.timeTakenMs,
        nodes: data.nodesExplored
      });
      
      setIsSolving(false);
      setIsAnimating(true);
      animateSolution(data.solution, 0);

    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to the backend server. Please make sure it is running on port 3000.');
      } else {
        setError(err.message);
      }
      setIsSolving(false);
    }
  };

  const animateSolution = (sol, step) => {
    if (step >= sol.length) {
      setIsAnimating(false);
      setCurrentStep(sol.length - 1);
      return;
    }

    setBoardState(sol[step]);
    setCurrentStep(step);

    // Stop early if reset or manual input occurred
    // Rely on unmount or resetSolutionState to clear timeout
    animationRef.current = setTimeout(() => {
      animateSolution(sol, step + 1);
    }, speedRef.current);
  };

  useEffect(() => {
    if (!isAnimating && !isSolving) {
      setManualInput(boardState.join(', '));
    }
  }, [boardState, isAnimating, isSolving]);

  const handleStepForward = () => {
    if (solution && currentStep < solution.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setBoardState(solution[nextStep]);
    }
  };

  const handleStepBack = () => {
    if (solution && currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setBoardState(solution[prevStep]);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="app-container">
      <h1>8 Puzzle Solver (A* Search)</h1>
      
      <div className="left-panel">
        <Board state={boardState} />
        <Metrics 
          moves={metrics.moves} 
          time={metrics.time} 
          nodes={metrics.nodes} 
        />
      </div>

      <div className="right-panel">
        <Controls
          onShuffle={handleShuffle}
          onSolve={handleSolve}
          onReset={handleReset}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          heuristic={heuristic}
          setHeuristic={setHeuristic}
          speed={speed}
          setSpeed={setSpeed}
          isSolving={isSolving}
          isAnimating={isAnimating}
          manualInput={manualInput}
          setManualInput={setManualInput}
          handleManualSubmit={handleManualSubmit}
          error={error}
          solutionMode={!!solution}
          solutionLength={solution ? solution.length : 0}
          currentStep={currentStep}
        />
      </div>

      <SolutionSteps solution={solution} currentStep={currentStep} />
    </div>
  );
}

export default App;
