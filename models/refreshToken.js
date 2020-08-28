const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  belongsTo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
