const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
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

  termsCondition: {
    type: Boolean,
    default: false,
  },

  oldPasswords: [String],
});

const userModel = model('User', UserSchema);

module.exports = userModel;
