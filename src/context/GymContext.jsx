import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const GymContext = createContext();

export function GymProvider({ children }) {
  const [exercises, setExercises] = useLocalStorage('gym-exercises', []);
  const [workouts, setWorkouts] = useLocalStorage('gym-workouts', []);
  const [history, setHistory] = useLocalStorage('gym-history', []);

  const value = useMemo(
    () => ({
      exercises,
      setExercises,
      workouts,
      setWorkouts,
      history,
      setHistory,
    }),
    [exercises, workouts, history]
  );

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

GymProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
