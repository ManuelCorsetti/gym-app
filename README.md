# Gym Tracker App

A lightweight gym tracking application built with React and Vite. The app lets you:

1. Create and manage exercises.
2. Create workout templates that include multiple exercises.
3. Start a workout either from a template or from scratch, log sets, and save the workout history.

## Getting started

```bash
npm install
npm run dev
```

Visit the displayed local URL to use the app.

## Available scripts

- `npm run dev` – start the development server.
- `npm run build` – create an optimized production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint against the project.

## Features

- Exercise library grouped by muscle group.
- Workout template builder with sets, reps, and notes per exercise.
- Workout session manager to log set data and view history.
- Data persistence using `localStorage` so your templates and history stay available between sessions.

## Tech stack

- [React](https://reactjs.org/) powered by [Vite](https://vitejs.dev/).
- UI components from [Material UI](https://mui.com/).
- ESLint with Prettier rules for consistent formatting.
