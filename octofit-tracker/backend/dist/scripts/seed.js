"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../models/user");
const team_1 = require("../models/team");
const activity_1 = require("../models/activity");
const leaderboard_1 = require("../models/leaderboard");
const workout_1 = require("../models/workout");
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            user_1.User.deleteMany({}),
            team_1.Team.deleteMany({}),
            activity_1.Activity.deleteMany({}),
            leaderboard_1.LeaderboardEntry.deleteMany({}),
            workout_1.Workout.deleteMany({}),
        ]);
        const users = await user_1.User.insertMany([
            { name: 'Ava Martinez', email: 'ava.martinez@example.com', role: 'captain' },
            { name: 'Noah Kim', email: 'noah.kim@example.com', role: 'member' },
            { name: 'Sofia Chen', email: 'sofia.chen@example.com', role: 'member' },
        ]);
        const teams = await team_1.Team.insertMany([
            { name: 'Blue Squad', members: 2, goal: 'Weekly streak challenge' },
            { name: 'Green Crew', members: 3, goal: 'Marathon prep' },
        ]);
        const activities = await activity_1.Activity.insertMany([
            { type: 'run', duration: 30, date: '2026-07-28' },
            { type: 'strength', duration: 45, date: '2026-07-27' },
            { type: 'cycling', duration: 60, date: '2026-07-26' },
        ]);
        const leaderboardEntries = await leaderboard_1.LeaderboardEntry.insertMany([
            { name: users[0].name, points: 980 },
            { name: users[1].name, points: 870 },
            { name: users[2].name, points: 845 },
        ]);
        const workouts = await workout_1.Workout.insertMany([
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
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
