import { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { GymProvider } from './context/GymContext.jsx';
import { ExerciseManager } from './components/ExerciseManager.jsx';
import { WorkoutManager } from './components/WorkoutManager.jsx';
import { WorkoutSessionManager } from './components/WorkoutSessionManager.jsx';

const tabs = [
  { value: 'exercises', label: 'Exercises' },
  { value: 'workouts', label: 'Workouts' },
  { value: 'sessions', label: 'Workout Sessions' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('sessions');

  return (
    <GymProvider>
      <AppBar position="static" color="primary">
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gym Tracker
          </Typography>
          <Tabs
            value={currentTab}
            onChange={(_event, value) => setCurrentTab(value)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box py={4}>
        <Container maxWidth="lg">
          {currentTab === 'exercises' ? <ExerciseManager /> : null}
          {currentTab === 'workouts' ? <WorkoutManager /> : null}
          {currentTab === 'sessions' ? <WorkoutSessionManager /> : null}
        </Container>
      </Box>
    </GymProvider>
  );
}
