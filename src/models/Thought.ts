/*
 * Thought model
 *
 * (Also specifies the reaction subdocument schema)
 *
 */
import {
  Schema,
  Types,
  model,
  type Document,
  SchemaTypeOptions,
} from 'mongoose';
import dayjs from 'dayjs';

// Interfaces

export interface IReaction extends Document {
  reactionId: Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}
export interface IThought extends Document {
  thoughtText: string;
  username: string;
  createdAt: Date;
  reactions: Array<IReaction>;
}

// Schemas

// Reaction schema defines the reaction field's subdocument
const reactionSchema = new Schema({
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
    //get: (value: Date) => value,
    get: (value: Date) => dayjs(value).format('YYYY-MMM-DD hh:mm:ss A'),
  },
});

const thoughtSchema: Schema<IThought> = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    /* Handling the createdAt getter with strict TypeScript:
      - Mongoose allows null dates, but dayjs cannot handle null values.
      - Using `as unknown` temporarily bypasses strict type checking.
      - Using `as SchemaTypeOptions<Date>` converts the object to Mongoose's 
        SchemaTypeOptions<Date>.
      Treating the string as a Date allows the getter to format it correctly. */
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (value: Date | undefined): string {
        return value ? dayjs(value).format('YYYY-MMM-DD hh:mm:ss A') : '';
      },
    } as unknown as SchemaTypeOptions<Date>,
    username: {
      type: String,
      required: true,
    },
    // Use reaction schema directly as a subdocument array
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true, // JSON output for virtual functions
      getters: true, // JSON output for getters (timestamp formatting)
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
