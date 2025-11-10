import { useMemo, useState } from 'react';
import WorkoutEntry from './WorkoutEntry.jsx';

const formatDateTime = (value) => new Date(value).toLocaleString();

const countTotalSets = (entries) => entries.reduce((acc, entry) => acc + entry.sets.length, 0);

export default function ActiveWorkout({
  exercises,
  templates,
  activeWorkout,
  onStartEmpty,
  onStartFromTemplate,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onComplete,
  onCancel,
}) {
  const [workoutName, setWorkoutName] = useState('');
  const [exerciseToAdd, setExerciseToAdd] = useState('');

  const hasExercises = exercises.length > 0;

  const availableExercises = useMemo(() => {
    if (!activeWorkout) {
      return exercises;
    }

    return exercises.filter(
      (exercise) => !activeWorkout.entries.some((entry) => entry.exerciseId === exercise.id)
    );
  }, [exercises, activeWorkout]);

  const totalSets = useMemo(
    () => (activeWorkout ? countTotalSets(activeWorkout.entries) : 0),
    [activeWorkout]
  );

  if (!activeWorkout) {
    return (
      <div>
        <div className="card-header">
          <h2>Active workout</h2>
        </div>

        <div className="card">
          <h3>Start a fresh workout</h3>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              onStartEmpty(workoutName);
              setWorkoutName('');
            }}
          >
            <label>
              Workout name (optional)
              <input
                type="text"
                value={workoutName}
                onChange={(event) => setWorkoutName(event.target.value)}
                placeholder="e.g. Push Day"
              />
            </label>
            <button type="submit" disabled={!hasExercises}>
              Start workout
            </button>
          </form>
          {!hasExercises && (
            <p className="muted">Add exercises first so you can log them here.</p>
          )}
        </div>

        <div className="card">
          <h3>Or load a template</h3>
          {templates.length === 0 ? (
            <p className="muted">
              Create a template to reuse your go-to exercise combinations and save time when you train.
            </p>
          ) : (
            <div className="list">
              {templates.map((template) => (
                <article className="card" key={template.id}>
                  <div className="card-header">
                    <div>
                      <h4>{template.name}</h4>
                      <p className="muted">{template.exerciseIds.length} exercises</p>
                    </div>
                    <button type="button" onClick={() => onStartFromTemplate(template.id)}>
                      Start
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h2>{activeWorkout.name}</h2>
        <div className="workout-meta">
          <span>Started {formatDateTime(activeWorkout.startedAt)}</span>
          <span>{activeWorkout.entries.length} exercises</span>
          <span>{totalSets} sets logged</span>
        </div>
      </div>

      <div className="card">
        <h3>Add an exercise</h3>
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            if (!exerciseToAdd) {
              return;
            }
            onAddExercise(exerciseToAdd);
            setExerciseToAdd('');
          }}
        >
          <select
            value={exerciseToAdd}
            onChange={(event) => setExerciseToAdd(event.target.value)}
            required
          >
            <option value="" disabled>
              Select an exercise
            </option>
            {availableExercises.map((exercise) => (
              <option value={exercise.id} key={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={availableExercises.length === 0}>
            Add to workout
          </button>
        </form>
        {availableExercises.length === 0 && (
          <p className="muted">All saved exercises are already part of this workout.</p>
        )}
      </div>

      <div className="list">
        {activeWorkout.entries.length === 0 ? (
          <div className="empty-state">No exercises yet. Add one above to start logging sets.</div>
        ) : (
          activeWorkout.entries.map((entry) => (
            <WorkoutEntry
              key={entry.id}
              entry={entry}
              onAddSet={onAddSet}
              onRemoveSet={onRemoveSet}
              onRemoveExercise={onRemoveExercise}
            />
          ))
        )}
      </div>

      <div className="stack">
        <button className="secondary" type="button" onClick={onCancel}>
          Cancel workout
        </button>
        <button type="button" onClick={onComplete} disabled={totalSets === 0}>
          Finish &amp; save
        </button>
      </div>
    </div>
  );
}
