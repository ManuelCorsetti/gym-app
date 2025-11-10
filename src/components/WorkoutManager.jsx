import { useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GymContext } from '../context/GymContext.jsx';
import { generateId } from '../utils/id.js';

const createExerciseConfig = () => ({ exerciseId: '', sets: 3, reps: 10, notes: '' });

export function WorkoutManager() {
  const { exercises, workouts, setWorkouts } = useContext(GymContext);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [items, setItems] = useState([createExerciseConfig()]);

  const handleAddExercise = () => {
    setItems((prev) => [...prev, createExerciseConfig()]);
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    const sanitizedItems = items
      .filter((item) => item.exerciseId)
      .map((item) => ({
        ...item,
        sets: Number.parseInt(item.sets, 10) || 0,
        reps: Number.parseInt(item.reps, 10) || 0,
      }));

    const newWorkout = {
      id: generateId('workout'),
      name: name.trim(),
      summary: summary.trim(),
      items: sanitizedItems,
    };

    setWorkouts((prev) => [...prev, newWorkout]);
    setName('');
    setSummary('');
    setItems([createExerciseConfig()]);
  };

  const exerciseLookup = useMemo(() => {
    return exercises.reduce((acc, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    }, {});
  }, [exercises]);

  return (
    <Stack spacing={3}>
      <Card component="form" onSubmit={handleSubmit}>
        <CardHeader title="Create a workout" subheader="Combine exercises into templates" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              required
              label="Workout name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              label="Summary"
              multiline
              minRows={2}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
            <Divider flexItem>
              <Typography variant="subtitle1">Exercises</Typography>
            </Divider>
            <Stack spacing={2}>
              {items.map((item, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <TextField
                          select
                          required
                          label="Exercise"
                          value={item.exerciseId}
                          onChange={(event) =>
                            handleItemChange(index, 'exerciseId', event.target.value)
                          }
                          fullWidth
                        >
                          <MenuItem value="" disabled>
                            Select exercise
                          </MenuItem>
                          {exercises.map((exercise) => (
                            <MenuItem key={exercise.id} value={exercise.id}>
                              {exercise.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField
                          type="number"
                          label="Sets"
                          value={item.sets}
                          onChange={(event) => handleItemChange(index, 'sets', event.target.value)}
                          fullWidth
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField
                          type="number"
                          label="Reps"
                          value={item.reps}
                          onChange={(event) => handleItemChange(index, 'reps', event.target.value)}
                          fullWidth
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          label="Notes"
                          value={item.notes}
                          onChange={(event) => handleItemChange(index, 'notes', event.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={1} display="flex" justifyContent="flex-end">
                        <IconButton
                          aria-label="Remove exercise"
                          color="error"
                          disabled={items.length === 1}
                          onClick={() => handleRemoveItem(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddExercise}
                disabled={exercises.length === 0}
              >
                Add another exercise
              </Button>
            </Stack>
            <Box>
              <Button type="submit" variant="contained" disabled={exercises.length === 0}>
                Save workout
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {workouts.length === 0 ? (
          <Typography color="text.secondary">
            No workout templates yet. Create one to build quick workouts later.
          </Typography>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader title={workout.name} subheader={workout.summary} />
              <CardContent>
                <Stack spacing={1}>
                  {workout.items.map((item) => {
                    const exercise = exerciseLookup[item.exerciseId];
                    return (
                      <Box key={item.exerciseId} display="flex" justifyContent="space-between">
                        <Typography>
                          {exercise ? exercise.name : 'Unknown exercise'}
                          {item.notes ? ` — ${item.notes}` : ''}
                        </Typography>
                        <Typography color="text.secondary">
                          {item.sets} sets × {item.reps} reps
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}
