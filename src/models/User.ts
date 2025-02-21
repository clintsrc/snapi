/*
 * User model
 *
 */
import { Schema, Types, model, type Document } from 'mongoose';

// Interfaces
export interface IUser extends Document {
  username: string;
  email: string;
  thoughts: Types.ObjectId[];
  friends: Types.ObjectId[];
  friendCount: number; // virtual property
}

// Schemas
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    /* Match regexp explanation:
     * ^[^\s@]+: Username: begins with one or more characters (no spaces or @).
     * @: a single @ is required
     * [^\s@]+\.: Domain (second level): one or more characters (no spaces or @) before the dot (\.), e.g: 'gmail.'
     * [^\s@]+$: Domain (top level): one or more characters (no spaces or @) after "gmail.", e.g.: com, org
     */
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, // JSON output for virtual functions
    },
  }
);

// Virtual properties
userSchema.virtual('friendCount').get(function (this: IUser) {
  return this.friends.length;
});

// Compile the model
const User = model<IUser>('User', userSchema);

export default User;
