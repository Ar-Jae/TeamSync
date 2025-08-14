

import React, { useRef, useEffect, useState } from 'react';
import { ydoc, provider } from '../utils/yjs-setup';

// We'll use a Yjs array to store drawing points: [x, y, color, size, isErase]
const ypoints = ydoc.getArray('canvas-points');


const COLORS = ['#000000', '#FF0000', '#00AA00', '#0000FF', '#FFA500', '#800080', '#FFFFFF'];
const SIZES = [2, 4, 8, 16];


const randomColor = () => COLORS[Math.floor(Math.random() * (COLORS.length - 1))];

const CanvasBoard = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [cursors, setCursors] = useState({});
  const [myCursorColor] = useState(randomColor());

  // Awareness: set my color and listen for all cursors
  useEffect(() => {
    provider.awareness.setLocalStateField('user', {
      color: myCursorColor,
    });
    const awarenessHandler = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      const cursorsObj = {};
      states.forEach(([clientId, state]) => {
        if (state.cursor) {
          cursorsObj[clientId] = { ...state.cursor, color: (state.user && state.user.color) || '#888' };
        }
      });
      setCursors(cursorsObj);
    };
    provider.awareness.on('change', awarenessHandler);
    return () => provider.awareness.off('change', awarenessHandler);
  }, [myCursorColor]);

  useEffect(() => {
    // Listen for remote updates
    const updateHandler = () => {
      setPoints(ypoints.toArray());
      drawPoints(ypoints.toArray());
    };
    ypoints.observe(updateHandler);
    setPoints(ypoints.toArray());
    drawPoints(ypoints.toArray());
    return () => ypoints.unobserve(updateHandler);
  }, []);

  // Draw points and cursors
  const drawPoints = (pts) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let prev = null;
    pts.forEach(([x, y, c, s, erase], i) => {
      ctx.strokeStyle = erase ? '#FFFFFF' : c || '#000000';
      ctx.lineWidth = s || 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (prev && !erase && !prev[4]) {
        ctx.moveTo(prev[0], prev[1]);
      } else {
        ctx.moveTo(x, y);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
      prev = [x, y, c, s, erase];
    });
    // Draw user cursors
    Object.entries(cursors).forEach(([clientId, { x, y, color }]) => {
      if (typeof x === 'number' && typeof y === 'number') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color || '#888';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = '12px sans-serif';
        ctx.fillStyle = color || '#888';
        ctx.fillText(clientId === provider.awareness.clientID ? 'You' : 'User', x + 10, y - 10);
        ctx.restore();
      }
    });
  };

  const getPointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    // Broadcast my cursor position
    provider.awareness.setLocalStateField('cursor', { x, y });
    return [x, y];
  };


  const handlePointerDown = (e) => {
    setDrawing(true);
    const [x, y] = getPointer(e);
    ypoints.push([[x, y, color, size, isErasing]]);
  };

  const handlePointerMove = (e) => {
    getPointer(e); // always update cursor position
    if (!drawing) return;
    const [x, y] = getPointer(e);
    ypoints.push([[x, y, color, size, isErasing]]);
  };

  const handlePointerUp = () => setDrawing(false);

  // On mouse/touch leave, clear my cursor
  const handlePointerLeave = () => {
    setDrawing(false);
    provider.awareness.setLocalStateField('cursor', null);
  };

  return (
    <div>
      <h3>Collaborative Canvas</h3>
      <div style={{ marginBottom: 8 }}>
        <span>Color: </span>
        {COLORS.map((c) => (
          <button
            key={c}
            style={{ background: c, width: 24, height: 24, border: color === c ? '2px solid #333' : '1px solid #ccc', marginRight: 4 }}
            onClick={() => { setColor(c); setIsErasing(false); }}
            aria-label={`Select color ${c}`}
          />
        ))}
        <span style={{ marginLeft: 16 }}>Brush: </span>
        <select value={size} onChange={e => setSize(Number(e.target.value))}>
          {SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
        <button style={{ marginLeft: 16 }} onClick={() => setIsErasing(e => !e)}>
          {isErasing ? 'Eraser (On)' : 'Eraser'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{ border: '1px solid #ccc', background: '#fff', touchAction: 'none' }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerLeave}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerLeave}
      />
    </div>
  );
};

export default CanvasBoard;
