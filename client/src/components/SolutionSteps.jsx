import React, { useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getDirectionDetails = (prev, curr) => {
  const prevZero = prev.indexOf(0);
  const currZero = curr.indexOf(0);
  const diff = currZero - prevZero;
  
  const swappedTile = prev[currZero];

  let dirName = '';
  let icon = null;

  if (diff === -3) { dirName = 'UP'; icon = <ArrowUp size={28} />; }
  else if (diff === 3) { dirName = 'DOWN'; icon = <ArrowDown size={28} />; }
  else if (diff === -1) { dirName = 'LEFT'; icon = <ArrowLeft size={28} />; }
  else if (diff === 1) { dirName = 'RIGHT'; icon = <ArrowRight size={28} />; }

  return { dirName, icon, swappedTile, prevZero, currZero };
};

const MiniBoard = ({ state, movedIndices }) => {
  return (
    <div className="mini-board">
      {state.map((val, idx) => {
        const isMoved = movedIndices.includes(idx);
        const isEmpty = val === 0;
        return (
          <div 
            key={idx} 
            className={`mini-tile ${isEmpty ? 'mini-empty' : ''} ${isMoved && !isEmpty ? 'mini-highlight' : ''} ${isMoved && isEmpty ? 'mini-highlight-zero' : ''}`}
          >
            {val !== 0 ? val : ''}
          </div>
        );
      })}
    </div>
  );
};

const SolutionSteps = ({ solution, currentStep }) => {
  if (!solution || solution.length < 2) return null;

  const stepsRef = useRef(null);

  useEffect(() => {
    if (stepsRef.current) {
      const activeElement = stepsRef.current.querySelector('.step-card.active');
      if (activeElement) {
        // Scroll the active card into the center of the list
        const parent = stepsRef.current;
        const scrollLeft = activeElement.offsetLeft - parent.offsetLeft - (parent.clientWidth - activeElement.clientWidth) / 2;
        parent.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  const moves = [];
  for (let i = 1; i < solution.length; i++) {
    const details = getDirectionDetails(solution[i - 1], solution[i]);
    moves.push({
      stepNum: i,
      state: solution[i],
      ...details
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="solution-panel glass-panel"
    >
      <div className="solution-header">
        <h3 className="solution-title">Detailed Solution Path</h3>
        <span className="solution-subtitle">Total Moves: {solution.length - 1}</span>
      </div>
      
      <div className="steps-container" ref={stepsRef}>
        <AnimatePresence>
          {moves.map((move, idx) => {
            const isActive = currentStep === move.stepNum;
            const isCompleted = currentStep >= move.stepNum;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.05, 1) }}
                className={`step-card ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="step-card-header">
                  <span className="step-num">Step {move.stepNum}</span>
                  <div className="step-icon-wrapper">
                    {move.icon}
                  </div>
                </div>

                <div className="step-details">
                  <p className="primary-desc">Space moved <strong>{move.dirName}</strong></p>
                  <p className="secondary-desc">
                    <CornerDownRight size={14} /> Swapped with Tile <strong>{move.swappedTile}</strong>
                  </p>
                </div>

                <div className="mini-board-wrapper">
                  <MiniBoard 
                    state={move.state} 
                    movedIndices={[move.prevZero, move.currZero]} 
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SolutionSteps;
