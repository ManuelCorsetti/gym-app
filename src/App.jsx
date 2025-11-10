import { useMemo } from 'react';
import ExerciseManager from './components/ExerciseManager.jsx';
import WorkoutTemplates from './components/WorkoutTemplates.jsx';
import ActiveWorkout from './components/ActiveWorkout.jsx';
import WorkoutHistory from './components/WorkoutHistory.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import './App.css';

const createId = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [exercises, setExercises] = useLocalStorage('ga_exercises', []);
  const [workoutTemplates, setWorkoutTemplates] = useLocalStorage('ga_workout_templates', []);
  const [activeWorkout, setActiveWorkout] = useLocalStorage('ga_active_workout', null);
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('ga_workout_history', []);

  const exercisesById = useMemo(() => {
    return exercises.reduce((acc, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    }, {});
  }, [exercises]);

  const handleCreateExercise = (exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        ...exercise,
        id: createId(),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleDeleteExercise = (exerciseId) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));

    setWorkoutTemplates((prev) =>
      prev
        .map((template) => ({
          ...template,
          exerciseIds: template.exerciseIds.filter((id) => id !== exerciseId),
        }))
        .filter((template) => template.exerciseIds.length > 0)
    );

    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      const filteredEntries = current.entries.filter((entry) => entry.exerciseId !== exerciseId);
      return { ...current, entries: filteredEntries };
    });
  };

  const handleCreateTemplate = ({ name, exerciseIds }) => {
    setWorkoutTemplates((prev) => [
      ...prev,
      {
        id: createId(),
        name,
        exerciseIds,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleDeleteTemplate = (templateId) => {
    setWorkoutTemplates((prev) => prev.filter((template) => template.id !== templateId));
  };

  const buildEntriesFromExerciseIds = (exerciseIds) =>
    exerciseIds
      .map((exerciseId) => exercisesById[exerciseId])
      .filter(Boolean)
      .map((exercise) => ({
        id: createId(),
        exerciseId: exercise.id,
        name: exercise.name,
        sets: [],
      }));

  const handleStartEmptyWorkout = (name) => {
    setActiveWorkout({
      id: createId(),
      name: name?.trim() ? name.trim() : `Workout ${new Date().toLocaleDateString()}`,
      templateId: null,
      startedAt: new Date().toISOString(),
      entries: [],
    });
  };

  const handleStartWorkoutFromTemplate = (templateId) => {
    const template = workoutTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }

    const entries = buildEntriesFromExerciseIds(template.exerciseIds);

    setActiveWorkout({
      id: createId(),
      name: template.name,
      templateId: template.id,
      startedAt: new Date().toISOString(),
      entries,
    });
  };

  const handleAddExerciseToActiveWorkout = (exerciseId) => {
    const exercise = exercisesById[exerciseId];
    if (!exercise) {
      return;
    }

    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      const alreadyExists = current.entries.some((entry) => entry.exerciseId === exerciseId);
      const newEntry = {
        id: createId(),
        exerciseId: exercise.id,
        name: exercise.name,
        sets: [],
      };

      return {
        ...current,
        entries: alreadyExists ? current.entries : [...current.entries, newEntry],
      };
    });
  };

  const handleRemoveExerciseFromActiveWorkout = (entryId) => {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      const updatedEntries = current.entries.filter((entry) => entry.id !== entryId);
      return { ...current, entries: updatedEntries };
    });
  };

  const handleAddSetToEntry = (entryId, setData) => {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      const updatedEntries = current.entries.map((entry) => {
        if (entry.id !== entryId) {
          return entry;
        }

        const normalizedSet = {
          id: createId(),
          weight: setData.weight ? Number(setData.weight) : null,
          reps: setData.reps ? Number(setData.reps) : null,
          notes: setData.notes?.trim() || '',
        };

        return {
          ...entry,
          sets: [...entry.sets, normalizedSet],
        };
      });

      return { ...current, entries: updatedEntries };
    });
  };

  const handleRemoveSetFromEntry = (entryId, setId) => {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      const updatedEntries = current.entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, sets: entry.sets.filter((set) => set.id !== setId) }
          : entry
      );

      return { ...current, entries: updatedEntries };
    });
  };

  const handleCompleteWorkout = () => {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      const completedWorkout = {
        ...current,
        endedAt: new Date().toISOString(),
      };

      setWorkoutHistory((prev) => [completedWorkout, ...prev]);
      return null;
    });
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Gym Planner &amp; Tracker</h1>
        <p className="tagline">
          Plan your training week, build reusable workouts, and capture your progress as soon as you
          finish a session.
        </p>
      </header>

      <main className="layout">
        <section className="panel">
          <ExerciseManager
            exercises={exercises}
            onCreate={handleCreateExercise}
            onDelete={handleDeleteExercise}
          />
        </section>

        <section className="panel">
          <WorkoutTemplates
            exercises={exercises}
            templates={workoutTemplates}
            onCreate={handleCreateTemplate}
            onDelete={handleDeleteTemplate}
          />
        </section>

        <section className="panel panel-wide">
          <ActiveWorkout
            exercises={exercises}
            templates={workoutTemplates}
            activeWorkout={activeWorkout}
            onStartEmpty={handleStartEmptyWorkout}
            onStartFromTemplate={handleStartWorkoutFromTemplate}
            onAddExercise={handleAddExerciseToActiveWorkout}
            onRemoveExercise={handleRemoveExerciseFromActiveWorkout}
            onAddSet={handleAddSetToEntry}
            onRemoveSet={handleRemoveSetFromEntry}
            onComplete={handleCompleteWorkout}
            onCancel={handleCancelWorkout}
          />
        </section>

        <section className="panel panel-wide">
          <WorkoutHistory history={workoutHistory} />
        </section>
      </main>
    </div>
  );
}
