import mongoose, { Schema, type Document } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  level: string;
}

const workoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true },
  level: { type: String, required: true },
});

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
