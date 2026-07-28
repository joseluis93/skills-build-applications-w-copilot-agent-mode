import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { User } from './models/user';
import { Team } from './models/team';
import { Activity } from './models/activity';
import { LeaderboardEntry } from './models/leaderboard';
import { Workout } from './models/workout';

const app = express();
const port = 8000;

const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

const sendCollection = (res: Response, resourceName: string, items: Array<Record<string, unknown>>) => {
  res.json({
    [resourceName]: items,
    count: items.length,
    apiBaseUrl,
  });
};

app.get(['/api/health', '/api/health/'], (_req: Request, res: Response) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.get(['/api/config', '/api/config/'], (_req: Request, res: Response) => {
  res.json({ apiBaseUrl });
});

app.get(['/api/users', '/api/users/'], async (_req: Request, res: Response) => {
  const users = await User.find({}).lean();
  sendCollection(res, 'users', users);
});

app.post(['/api/users', '/api/users/'], async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(201).json({ user, apiBaseUrl });
});

app.get(['/api/teams', '/api/teams/'], async (_req: Request, res: Response) => {
  const teams = await Team.find({}).lean();
  sendCollection(res, 'teams', teams);
});

app.post(['/api/teams', '/api/teams/'], async (req: Request, res: Response) => {
  const team = await Team.create(req.body);
  res.status(201).json({ team, apiBaseUrl });
});

app.get(['/api/activities', '/api/activities/'], async (_req: Request, res: Response) => {
  const activities = await Activity.find({}).lean();
  sendCollection(res, 'activities', activities);
});

app.post(['/api/activities', '/api/activities/'], async (req: Request, res: Response) => {
  const activity = await Activity.create(req.body);
  res.status(201).json({ activity, apiBaseUrl });
});

app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find({}).lean();
  sendCollection(res, 'leaderboard', leaderboard);
});

app.get(['/api/workouts', '/api/workouts/'], async (_req: Request, res: Response) => {
  const workouts = await Workout.find({}).lean();
  sendCollection(res, 'workouts', workouts);
});

app.post(['/api/workouts', '/api/workouts/'], async (req: Request, res: Response) => {
  const workout = await Workout.create(req.body);
  res.status(201).json({ workout, apiBaseUrl });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/octofit_db')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.warn('MongoDB connection unavailable, continuing without database:', error);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
      console.log(`API base URL: ${apiBaseUrl}`);
    });
  });
