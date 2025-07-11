const express = require('express');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  location: {
    type: String,
    required: true,
    maxlength: 100
  },
  email:{
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ // Basic email validation
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('user', userSchema);