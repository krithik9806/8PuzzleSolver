import React from 'react';
import { Shuffle, Play, RotateCcw, ChevronLeft, ChevronRight, AlertCircle, Settings } from 'lucide-react';

const Controls = ({
  onShuffle,
  onSolve,
  onReset,
  onStepForward,
  onStepBack,
  heuristic,
  setHeuristic,
  speed,
  setSpeed,
  isSolving,
  isAnimating,
  manualInput,
  setManualInput,
  handleManualSubmit,
  error,
  solutionMode,
  solutionLength,
  currentStep
}) => {
  return (
    <div className="glass-panel">
      <div className="control-group">
        <label><Settings size={14} style={{display:'inline', marginBottom:'-2px'}}/> Manual Config</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="control-input"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g., 1, 2, 3, 4, 5, 0, 6, 7, 8"
            disabled={isSolving || isAnimating}
          />
          <button 
            className="btn btn-secondary" 
            style={{flex: '0 0 auto', padding: '0.85rem 1rem'}}
            onClick={handleManualSubmit}
            disabled={isSolving || isAnimating}
          >
            SET
          </button>
        </div>
        {error && (
          <div className="error-msg">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      <div className="control-group">
        <label>Heuristic Function</label>
        <select 
          className="control-input"
          style={{paddingRight: '1rem'}}
          value={heuristic}
          onChange={(e) => setHeuristic(e.target.value)}
          disabled={isSolving || isAnimating}
        >
          <option value="manhattan">Manhattan Distance</option>
          <option value="misplaced">Misplaced Tiles</option>
        </select>
      </div>

      <div className="control-group">
        <label style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>Animation Speed</span>
          <span style={{color: '#fff'}}>{speed}ms</span>
        </label>
        <input 
          type="range" 
          min="50" 
          max="1000" 
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={isAnimating}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-secondary" onClick={onShuffle} disabled={isSolving || isAnimating}>
          <Shuffle size={18} />
          Shuffle
        </button>
        <button className="btn btn-primary" onClick={onSolve} disabled={isSolving || isAnimating}>
          <Play size={18} fill="currentColor" />
          {isSolving ? 'Solving...' : 'Solve AI'}
        </button>
        <button className="btn btn-secondary" onClick={onReset} disabled={isSolving || isAnimating}>
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      {solutionMode && (
        <div className="control-group" style={{marginTop: '2rem', borderTop: '1px solid rgba(0, 240, 255, 0.2)', paddingTop: '1.5rem'}}>
          <label style={{textAlign: 'center', color: '#fff', fontSize: '1rem'}}>
            Step-by-step Review ({currentStep} / {solutionLength - 1})
          </label>
          <div className="btn-group" style={{marginTop: '1rem'}}>
            <button 
              className="btn btn-secondary" 
              onClick={onStepBack} 
              disabled={isAnimating || currentStep === 0}
            >
              <ChevronLeft size={20} />
              Prev
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={onStepForward} 
              disabled={isAnimating || currentStep === solutionLength - 1}
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
