import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    userAgent: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
     profilePhoto: {
      type: String,
    },
        neckCircumference: {
      type: Number,
      min: 0,
    },
    waistCircumference: {
      type: Number,
      min: 0,
    },

    targetWeight: {
      type: Number,
      min: 0,
      default: 66,
    },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    refreshTokens: [refreshTokenSchema],
    emailVerificationCode: String,
    emailVerificationExpires: Date
});

export default mongoose.model('User', userSchema);
