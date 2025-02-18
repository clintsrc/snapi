/*
 * Thought model
 * Also specifies the reaction schema
 *
 */
import { Schema, Types, model, type Document } from 'mongoose';

// Interfaces
export interface IThought extends Document {
  thoughtText: string;
  username: string;
  createdAt: Date;
  // Array of reactions (subdocuments)
  reactions: Array<{
    reactionId: Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
  }>;
}

// Schemas
// Reaction schema defines the reaction field's subdocument
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (value: any) => (value ? value.toISOString() : ''),
    },
  },
  {
    _id: false, // we're using reactionId instead of the built-in _id
  }
);

const thoughtSchema: Schema<IThought> = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (value: any) => (value ? value.toISOString() : ''),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Using reaction schema directly as a subdocument array
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Virtual properties
thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
  return this.reactions.length;
});

// Compile the model
const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
