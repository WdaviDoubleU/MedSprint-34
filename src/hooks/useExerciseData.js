import { useState, useEffect } from 'react';

// exerciseData shape: { 'YYYY-MM-DD': level } where level is 0..4
const STORAGE_KEY = 'medsprint_exercise_data';

export function useExerciseData() {
  const [data, setData] = useState({});

  // Load initial data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load exercise data', e);
    }
  }, []);

  // Add points to a specific date
  const addPoints = (dateStr, points) => {
    setData((prev) => {
      const currentPoints = prev[dateStr] || 0;
      const newData = { ...prev, [dateStr]: currentPoints + points };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  };

  return { data, addPoints };
}
