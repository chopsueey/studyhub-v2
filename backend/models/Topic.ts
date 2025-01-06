import mongoose from 'mongoose';
import type { INote } from './Note';
import type { BaseDocument } from 'backend/types/mongoose';

export interface ITopic extends BaseDocument {
  name: string;
  notes: INote[];
}

const TopicSchema = new mongoose.Schema<ITopic>({
  name: {
    type: String,
    required: true
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

export const Topic = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);
