import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  members: number;
  goal: string;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  members: { type: Number, required: true },
  goal: { type: String, required: true },
});

export const Team = mongoose.model<ITeam>('Team', teamSchema);
