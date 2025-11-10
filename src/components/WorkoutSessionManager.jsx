import { useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HistoryIcon from '@mui/icons-material/History';
import { GymContext } from '../context/GymContext.jsx';
import { generateId } from '../utils/id.js';

const createEmptySet = () => ({ weight: '', reps: '', notes: '' });

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export function WorkoutSessionManager() {
  const { exercises, workouts, history, setHistory } = useContext(GymContext);
  const exerciseLookup = useMemo(() => {
    return exercises.reduce((acc, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    }, {});
  }, [exercises]);
  const workoutLookup = useMemo(() => {
    return workouts.reduce((acc, workout) => {
      acc[workout.id] = workout;
      return acc;
    }, {});
  }, [workouts]);

  const [activeSession, setActiveSession] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customName, setCustomName] = useState('');

  const startSession = (base) => {
    const sessionName = base.name || customName.trim() || `Quick workout ${new Date().toLocaleDateString()}`;
    const sessionItems = base.items || [];

    setActiveSession({
      id: generateId('session'),
      name: sessionName,
      templateId: base.templateId || null,
      startedAt: new Date().toISOString(),
      entries: sessionItems.map((item) => ({
        id: generateId('session-exercise'),
        exerciseId: item.exerciseId,
        targetSets: item.sets || 0,
        targetReps: item.reps || 0,
        notes: item.notes || '',
        sets: [],
      })),
    });
    setCustomName('');
    setSelectedTemplate('');
  };

  const handleStartTemplate = () => {
    if (!selectedTemplate) {
      return;
    }
    const template = workoutLookup[selectedTemplate];
    if (!template) {
      return;
    }
    startSession({ name: template.name, items: template.items, templateId: template.id });
  };

  const handleStartEmpty = () => {
    startSession({ name: customName, items: [] });
  };

  const addExerciseToSession = () => {
    if (!activeSession) return;
    const availableExerciseId = exercises[0]?.id || '';
    setActiveSession((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          id: generateId('session-exercise'),
          exerciseId: availableExerciseId,
          targetSets: 0,
          targetReps: 0,
          notes: '',
          sets: [],
        },
      ],
    }));
  };

  const updateEntry = (entryId, field, value) => {
    setActiveSession((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const addSetToEntry = (entryId, setData) => {
    setActiveSession((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              sets: [
                ...entry.sets,
                {
                  id: generateId('set'),
                  weight: setData.weight ? Number.parseFloat(setData.weight) : null,
                  reps: setData.reps ? Number.parseInt(setData.reps, 10) : null,
                  notes: setData.notes || '',
                },
              ],
            }
          : entry
      ),
    }));
  };

  const finishSession = () => {
    if (!activeSession) return;
    const completed = {
      ...activeSession,
      finishedAt: new Date().toISOString(),
    };
    setHistory((prev) => [completed, ...prev]);
    setActiveSession(null);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          avatar={<FitnessCenterIcon color="primary" fontSize="large" />}
          title="Start a workout"
          subheader="Use a template or start from scratch"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1">Use a template</Typography>
                <TextField
                  select
                  label="Workout template"
                  value={selectedTemplate}
                  onChange={(event) => setSelectedTemplate(event.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Select template</MenuItem>
                  {workouts.map((workout) => (
                    <MenuItem key={workout.id} value={workout.id}>
                      {workout.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleStartTemplate}
                  disabled={!selectedTemplate || workouts.length === 0}
                >
                  Start from template
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1">Start from scratch</Typography>
                <TextField
                  label="Workout name"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  helperText="Optional. We'll pick a name if you leave it blank."
                />
                <Button variant="outlined" onClick={handleStartEmpty}>
                  Start empty workout
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {activeSession ? (
        <Card>
          <CardHeader
            title={activeSession.name}
            subheader={`Started at ${formatDate(activeSession.startedAt)}`}
          />
          <CardContent>
            <Stack spacing={3}>
              {activeSession.entries.length === 0 ? (
                <Typography color="text.secondary">
                  No exercises yet. Add one to begin tracking sets.
                </Typography>
              ) : (
                activeSession.entries.map((entry) => {
                  const exercise = exerciseLookup[entry.exerciseId];
                  return (
                    <Card key={entry.id} variant="outlined">
                      <CardHeader
                        title={exercise ? exercise.name : 'Select an exercise'}
                        subheader={entry.notes}
                      />
                      <CardContent>
                        <Stack spacing={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                select
                                label="Exercise"
                                value={entry.exerciseId}
                                onChange={(event) =>
                                  updateEntry(entry.id, 'exerciseId', event.target.value)
                                }
                                fullWidth
                              >
                                {exercises.map((exerciseOption) => (
                                  <MenuItem key={exerciseOption.id} value={exerciseOption.id}>
                                    {exerciseOption.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={6} md={2}>
                              <TextField
                                type="number"
                                label="Target sets"
                                value={entry.targetSets}
                                onChange={(event) =>
                                  updateEntry(entry.id, 'targetSets', event.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs={6} md={2}>
                              <TextField
                                type="number"
                                label="Target reps"
                                value={entry.targetReps}
                                onChange={(event) =>
                                  updateEntry(entry.id, 'targetReps', event.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Notes"
                                value={entry.notes}
                                onChange={(event) => updateEntry(entry.id, 'notes', event.target.value)}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                          <Divider />
                          <SetLogger entry={entry} onAddSet={addSetToEntry} />
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {entry.sets.map((set) => (
                              <Chip
                                key={set.id}
                                label={`${set.reps ?? '?'} reps${
                                  set.weight ? ` @ ${set.weight} ${'kg'}` : ''
                                }${set.notes ? ` — ${set.notes}` : ''}`}
                                color="secondary"
                              />
                            ))}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })
              )}
              <Button
                variant="outlined"
                onClick={addExerciseToSession}
                disabled={exercises.length === 0}
              >
                Add exercise to session
              </Button>
              <Divider />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={finishSession}>
                  Finish workout
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader
          avatar={<HistoryIcon color="action" />}
          title="Workout history"
          subheader="Completed workouts are saved here"
        />
        <CardContent>
          <Stack spacing={2}>
            {history.length === 0 ? (
              <Typography color="text.secondary">
                You haven't finished a workout yet. Start one above to see it here.
              </Typography>
            ) : (
              history.map((session) => (
                <Card key={session.id} variant="outlined">
                  <CardHeader
                    title={session.name}
                    subheader={`${formatDate(session.startedAt)} — ${formatDate(
                      session.finishedAt
                    )}`}
                  />
                  <CardContent>
                    <Stack spacing={1}>
                      {session.entries.map((entry) => {
                        const exercise = exerciseLookup[entry.exerciseId];
                        return (
                          <Box key={entry.id}>
                            <Typography variant="subtitle2">
                              {exercise ? exercise.name : 'Exercise'}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {entry.sets.length === 0 ? (
                                <Typography color="text.secondary">No sets logged.</Typography>
                              ) : (
                                entry.sets.map((set) => (
                                  <Chip
                                    key={set.id}
                                    label={`${set.reps ?? '?'} reps${
                                      set.weight ? ` @ ${set.weight} kg` : ''
                                    }${set.notes ? ` — ${set.notes}` : ''}`}
                                  />
                                ))
                              )}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function SetLogger({ entry, onAddSet }) {
  const [setForm, setSetForm] = useState(createEmptySet());

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!entry.exerciseId) return;
    onAddSet(entry.id, setForm);
    setSetForm(createEmptySet());
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            type="number"
            label="Weight (kg)"
            value={setForm.weight}
            onChange={(event) => setSetForm((prev) => ({ ...prev, weight: event.target.value }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="number"
            label="Reps"
            value={setForm.reps}
            onChange={(event) => setSetForm((prev) => ({ ...prev, reps: event.target.value }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Notes"
            value={setForm.notes}
            onChange={(event) => setSetForm((prev) => ({ ...prev, notes: event.target.value }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button type="submit" variant="contained" fullWidth>
            Log set
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
