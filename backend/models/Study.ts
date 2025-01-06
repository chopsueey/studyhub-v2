import mongoose from 'mongoose';
import type { ITopic } from './Topic';

export interface IStudy {
  name: string;
  topics: ITopic[];
}

const StudySchema = new mongoose.Schema<IStudy>({
  name: {
    type: String,
    required: true
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }
  ]
});

export const Study = mongoose.models.Study || mongoose.model<IStudy>('Study', StudySchema);
