import mongoose, { Schema, type Document } from 'mongoose';

export interface IActivity extends Document {
  type: string;
  duration: number;
  date: string;
}

const activitySchema = new Schema<IActivity>({
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
});

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
