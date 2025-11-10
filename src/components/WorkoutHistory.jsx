const formatDateTime = (value) => new Date(value).toLocaleString();

const formatDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const minutes = Math.max(1, Math.round((endDate - startDate) / 60000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

const countSets = (workout) =>
  workout.entries.reduce((acc, entry) => acc + entry.sets.length, 0);

export default function WorkoutHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div>
        <div className="card-header">
          <h2>Completed workouts</h2>
        </div>
        <div className="empty-state">
          Save a workout to see your recent sessions and revisit them later.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h2>Completed workouts</h2>
        <span className="exercise-count">{history.length} saved</span>
      </div>
      <div className="history-list">
        {history.map((workout) => (
          <article className="history-item" key={workout.id}>
            <div className="card-header">
              <div>
                <h3>{workout.name}</h3>
                <p className="muted">Finished {workout.endedAt ? formatDateTime(workout.endedAt) : 'n/a'}</p>
              </div>
            </div>
            <div className="workout-meta">
              <span>Started {formatDateTime(workout.startedAt)}</span>
              {workout.endedAt && <span>Duration {formatDuration(workout.startedAt, workout.endedAt)}</span>}
              <span>{workout.entries.length} exercises</span>
              <span>{countSets(workout)} total sets</span>
            </div>
            <div className="history-entries">
              {workout.entries.map((entry) => (
                <div className="card" key={entry.id}>
                  <div className="card-header">
                    <h4>{entry.name}</h4>
                    <span className="badge">{entry.sets.length} sets</span>
                  </div>
                  {entry.sets.length === 0 ? (
                    <p className="muted">No sets were recorded.</p>
                  ) : (
                    <ul className="set-list">
                      {entry.sets.map((set, index) => (
                        <li key={set.id}>
                          <div className="set-details">
                            <strong>Set {index + 1}</strong>
                            <span>
                              {set.reps ? `${set.reps} reps` : 'Reps n/a'}
                              {set.weight !== null && set.weight !== undefined
                                ? ` @ ${set.weight}${Number.isFinite(set.weight) ? 'kg' : ''}`
                                : ''}
                            </span>
                            {set.notes && <span className="muted">{set.notes}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
