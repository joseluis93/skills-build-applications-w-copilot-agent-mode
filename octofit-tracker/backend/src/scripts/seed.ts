import mongoose from 'mongoose';
import { User } from '../models/user';
import { Team } from '../models/team';
import { Activity } from '../models/activity';
import { LeaderboardEntry } from '../models/leaderboard';
import { Workout } from '../models/workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Ava Martinez', email: 'ava.martinez@example.com', role: 'captain' },
      { name: 'Noah Kim', email: 'noah.kim@example.com', role: 'member' },
      { name: 'Sofia Chen', email: 'sofia.chen@example.com', role: 'member' },
    ]);

    const teams = await Team.insertMany([
      { name: 'Blue Squad', members: 2, goal: 'Weekly streak challenge' },
      { name: 'Green Crew', members: 3, goal: 'Marathon prep' },
    ]);

    const activities = await Activity.insertMany([
      { type: 'run', duration: 30, date: '2026-07-28' },
      { type: 'strength', duration: 45, date: '2026-07-27' },
      { type: 'cycling', duration: 60, date: '2026-07-26' },
    ]);

    const leaderboardEntries = await LeaderboardEntry.insertMany([
      { name: users[0].name, points: 980 },
      { name: users[1].name, points: 870 },
      { name: users[2].name, points: 845 },
    ]);

    const workouts = await Workout.insertMany([
      { title: 'Morning mobility', level: 'beginner' },
      { title: 'Interval cardio', level: 'intermediate' },
      { title: 'Core strength', level: 'advanced' },
    ]);

    console.log('Seeded users:', users.length);
    console.log('Seeded teams:', teams.length);
    console.log('Seeded activities:', activities.length);
    console.log('Seeded leaderboard entries:', leaderboardEntries.length);
    console.log('Seeded workouts:', workouts.length);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
