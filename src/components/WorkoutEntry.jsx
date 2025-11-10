import { useState } from 'react';

export default function WorkoutEntry({ entry, onAddSet, onRemoveSet, onRemoveExercise }) {
  const [setForm, setSetForm] = useState({ weight: '', reps: '', notes: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!setForm.reps && !setForm.notes && !setForm.weight) {
      return;
    }

    onAddSet(entry.id, setForm);
    setSetForm({ weight: '', reps: '', notes: '' });
  };

  return (
    <article className="card">
      <div className="card-header">
        <div>
          <h3>{entry.name}</h3>
          <p className="muted">{entry.sets.length} sets logged</p>
        </div>
        <button className="ghost" type="button" onClick={() => onRemoveExercise(entry.id)}>
          Remove
        </button>
      </div>

      {entry.sets.length === 0 ? (
        <p className="muted">No sets yet — add your first set below.</p>
      ) : (
        <ul className="set-list">
          {entry.sets.map((set, index) => (
            <li key={set.id}>
              <div className="set-details">
                <strong>Set {index + 1}</strong>
                <span>
                  {set.reps ? `${set.reps} reps` : 'Reps not recorded'}
                  {set.weight !== null && set.weight !== undefined
                    ? ` @ ${set.weight}${Number.isFinite(set.weight) ? 'kg' : ''}`
                    : ''}
                </span>
                {set.notes && <span className="muted">{set.notes}</span>}
              </div>
              <button className="ghost" type="button" onClick={() => onRemoveSet(entry.id, set.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="stack">
          <label>
            Weight
            <input
              type="number"
              name="weight"
              min="0"
              step="0.5"
              value={setForm.weight}
              onChange={handleChange}
              placeholder="kg"
            />
          </label>
          <label>
            Reps
            <input
              type="number"
              name="reps"
              min="0"
              step="1"
              value={setForm.reps}
              onChange={handleChange}
              placeholder="repetitions"
            />
          </label>
        </div>
        <label>
          Notes
          <textarea
            name="notes"
            value={setForm.notes}
            onChange={handleChange}
            placeholder="Form cues, tempo, RPE, etc."
          />
        </label>
        <button type="submit">Add set</button>
      </form>
    </article>
  );
}
