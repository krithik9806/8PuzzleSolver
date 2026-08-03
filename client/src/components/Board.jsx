import React from 'react';
import { motion } from 'framer-motion';

const Board = ({ state }) => {
  return (
    <div className="board-wrapper">
      <div className="board-container">
        {state.map((val, idx) => {
          if (val === 0) {
            return (
              <motion.div 
                key="empty" 
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="tile empty" 
              />
            );
          }
          return (
            <motion.div
              layout
              key={val}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.8
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 240, 255, 0.6)" }}
              className="tile"
            >
              {val}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
