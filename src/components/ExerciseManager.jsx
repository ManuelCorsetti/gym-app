import { useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { GymContext } from '../context/GymContext.jsx';
import { generateId } from '../utils/id.js';

const muscleGroups = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Full Body',
  'Cardio',
];

export function ExerciseManager() {
  const { exercises, setExercises } = useContext(GymContext);
  const [form, setForm] = useState({
    name: '',
    muscleGroup: '',
    equipment: '',
  });

  const resetForm = () =>
    setForm({
      name: '',
      muscleGroup: '',
      equipment: '',
    });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.muscleGroup.trim()) {
      return;
    }

    const newExercise = {
      id: generateId('exercise'),
      name: form.name.trim(),
      muscleGroup: form.muscleGroup.trim(),
      equipment: form.equipment.trim(),
    };

    setExercises((prev) => [...prev, newExercise]);
    resetForm();
  };

  const groupedExercises = useMemo(() => {
    return exercises.reduce((acc, exercise) => {
      if (!acc[exercise.muscleGroup]) {
        acc[exercise.muscleGroup] = [];
      }
      acc[exercise.muscleGroup].push(exercise);
      return acc;
    }, {});
  }, [exercises]);

  return (
    <Stack spacing={3}>
      <Card component="form" onSubmit={handleSubmit}>
        <CardHeader title="Create a new exercise" subheader="Add exercises to use in your workouts" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                label="Exercise name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                required
                label="Muscle group"
                value={form.muscleGroup}
                onChange={(event) => setForm((prev) => ({ ...prev, muscleGroup: event.target.value }))}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="" disabled>
                  Select...
                </option>
                {muscleGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Equipment (optional)"
                value={form.equipment}
                onChange={(event) => setForm((prev) => ({ ...prev, equipment: event.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Save exercise
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {exercises.length === 0 ? (
          <Typography color="text.secondary">No exercises yet. Create one to get started.</Typography>
        ) : (
          Object.entries(groupedExercises).map(([group, groupExercises]) => (
            <Card key={group}>
              <CardHeader title={group} />
              <CardContent>
                <Stack spacing={1}>
                  {groupExercises.map((exercise) => (
                    <Box
                      key={exercise.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle1">{exercise.name}</Typography>
                        {exercise.equipment ? (
                          <Typography variant="body2" color="text.secondary">
                            Equipment: {exercise.equipment}
                          </Typography>
                        ) : null}
                      </Box>
                      <Chip label={group} color="secondary" variant="outlined" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}
