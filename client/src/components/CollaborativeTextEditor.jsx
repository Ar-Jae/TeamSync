import React, { useEffect, useRef, useState } from 'react';
import { ydoc, yarray } from '../utils/yjs-setup';

const CollaborativeTextEditor = () => {
  const [value, setValue] = useState('');
  const isLocal = useRef(false);

  useEffect(() => {
    // Listen for remote changes
    const updateHandler = () => {
      if (!isLocal.current) {
        setValue(yarray.toArray().join(''));
      }
    };
    yarray.observe(updateHandler);
    setValue(yarray.toArray().join(''));
    return () => yarray.unobserve(updateHandler);
  }, []);

  const handleChange = (e) => {
    isLocal.current = true;
    yarray.delete(0, yarray.length);
    yarray.insert(0, e.target.value.split(''));
    setValue(e.target.value);
    isLocal.current = false;
  };

  return (
    <textarea
      style={{ width: '100%', height: 120 }}
      value={value}
      onChange={handleChange}
      placeholder="Collaborative notes..."
    />
  );
};

export default CollaborativeTextEditor;
