const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: String,

    oldPasswords: {
      type: [String],
      maxItems: 5,
    },

    lastPasswordUpdateDate: Date,
  },
  {
    timestamps: true,
  }
);

const userModel = model('User', UserSchema);

module.exports = userModel;
