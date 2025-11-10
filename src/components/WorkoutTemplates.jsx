import { useMemo, useState } from 'react';

export default function WorkoutTemplates({ exercises, templates, onCreate, onDelete }) {
  const [name, setName] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const exerciseOptions = useMemo(
    () =>
      exercises.map((exercise) => ({
        id: exercise.id,
        label: exercise.name,
      })),
    [exercises]
  );

  const toggleExercise = (exerciseId) => {
    setSelectedIds((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || selectedIds.length === 0) {
      return;
    }

    onCreate({ name: name.trim(), exerciseIds: selectedIds });
    setName('');
    setSelectedIds([]);
  };

  return (
    <div>
      <div className="card-header">
        <h2>Workout templates</h2>
        <span className="exercise-count">{templates.length} saved</span>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Template name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Upper Body Strength"
            required
          />
        </label>

        <fieldset className="card">
          <legend className="muted">Include exercises</legend>
          {exerciseOptions.length === 0 ? (
            <p className="muted">Add exercises first to build a template.</p>
          ) : (
            <div className="stack">
              {exerciseOptions.map((option) => (
                <label key={option.id} className="stack">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(option.id)}
                    onChange={() => toggleExercise(option.id)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <button type="submit" disabled={exerciseOptions.length === 0}>
          Save template
        </button>
      </form>

      <hr className="divider" />

      {templates.length === 0 ? (
        <div className="empty-state">
          Templates let you jump straight into a workout with your favourite exercise combinations.
        </div>
      ) : (
        <div className="list">
          {templates.map((template) => (
            <article className="card" key={template.id}>
              <div className="card-header">
                <h3>{template.name}</h3>
                <button className="ghost" type="button" onClick={() => onDelete(template.id)}>
                  Delete
                </button>
              </div>

              <div className="stack">
                {template.exerciseIds.map((id) => {
                  const exercise = exercises.find((item) => item.id === id);
                  return (
                    <span className="badge" key={id}>
                      {exercise ? exercise.name : 'Unknown exercise'}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
