import { useState } from 'react';

export default function ExerciseManager({ exercises, onCreate, onDelete }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      return;
    }

    onCreate({
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
    });

    setForm({ name: '', category: '', description: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this exercise? It will also be removed from workouts.')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div className="card-header">
        <h2>Exercises</h2>
        <span className="exercise-count">{exercises.length} saved</span>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Exercise name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Bench Press"
            required
          />
        </label>

        <label>
          Category (optional)
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Chest"
          />
        </label>

        <label>
          Notes (optional)
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Cues, tempo, equipment..."
          />
        </label>

        <button type="submit">Save exercise</button>
      </form>

      <hr className="divider" />

      {exercises.length === 0 ? (
        <div className="empty-state">Create your first exercise to start building workouts.</div>
      ) : (
        <div className="list">
          {exercises.map((exercise) => (
            <article className="card" key={exercise.id}>
              <div className="card-header">
                <div>
                  <h3>{exercise.name}</h3>
                  {exercise.category && <p className="muted">{exercise.category}</p>}
                </div>
                <button className="ghost" type="button" onClick={() => handleDelete(exercise.id)}>
                  Delete
                </button>
              </div>
              {exercise.description && <p className="muted">{exercise.description}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
