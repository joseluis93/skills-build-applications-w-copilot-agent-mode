"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./models/user");
const team_1 = require("./models/team");
const activity_1 = require("./models/activity");
const leaderboard_1 = require("./models/leaderboard");
const workout_1 = require("./models/workout");
const app = (0, express_1.default)();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use(express_1.default.json());
const sendCollection = (res, resourceName, items) => {
    res.json({
        [resourceName]: items,
        count: items.length,
        apiBaseUrl,
    });
};
app.get(['/api/health', '/api/health/'], (_req, res) => {
    res.json({ status: 'ok', apiBaseUrl });
});
app.get(['/api/config', '/api/config/'], (_req, res) => {
    res.json({ apiBaseUrl });
});
app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const users = await user_1.User.find({}).lean();
    sendCollection(res, 'users', users);
});
app.post(['/api/users', '/api/users/'], async (req, res) => {
    const user = await user_1.User.create(req.body);
    res.status(201).json({ user, apiBaseUrl });
});
app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const teams = await team_1.Team.find({}).lean();
    sendCollection(res, 'teams', teams);
});
app.post(['/api/teams', '/api/teams/'], async (req, res) => {
    const team = await team_1.Team.create(req.body);
    res.status(201).json({ team, apiBaseUrl });
});
app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const activities = await activity_1.Activity.find({}).lean();
    sendCollection(res, 'activities', activities);
});
app.post(['/api/activities', '/api/activities/'], async (req, res) => {
    const activity = await activity_1.Activity.create(req.body);
    res.status(201).json({ activity, apiBaseUrl });
});
app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const leaderboard = await leaderboard_1.LeaderboardEntry.find({}).lean();
    sendCollection(res, 'leaderboard', leaderboard);
});
app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const workouts = await workout_1.Workout.find({}).lean();
    sendCollection(res, 'workouts', workouts);
});
app.post(['/api/workouts', '/api/workouts/'], async (req, res) => {
    const workout = await workout_1.Workout.create(req.body);
    res.status(201).json({ workout, apiBaseUrl });
});
mongoose_1.default
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
