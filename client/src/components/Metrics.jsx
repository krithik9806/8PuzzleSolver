import React from 'react';

const Metrics = ({ moves, time, nodes }) => {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-value">{moves > 0 ? moves : '-'}</div>
        <div className="metric-label">Moves</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{time > 0 ? `${time}ms` : '-'}</div>
        <div className="metric-label">Time</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{nodes > 0 ? nodes : '-'}</div>
        <div className="metric-label">Nodes Explored</div>
      </div>
    </div>
  );
};

export default Metrics;
