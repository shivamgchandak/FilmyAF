import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      index: true,
    },
    avatarEmoji: {
      type: String,
      default: '🎬',
    },
    /* Takes wallet. Accumulates: DAILY_GRANT is added for every calendar day
       since takesGrantedOn, and nothing ever expires. Topped up lazily on
       read by takes.service#grantDailyTakes. */
    takesBalance: {
      type: Number,
      default: 30, // SIGNUP_GRANT — see services/takes.service.js
      min: 0,
    },
    takesGrantedOn: {
      type: String, // YYYY-MM-DD in IST
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (plain) {
  return comparePassword(plain, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model('User', userSchema);
