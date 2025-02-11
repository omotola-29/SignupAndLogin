const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
        },
    },
    { trimestamps: true,
      versionKey: false
    }
);

module.exports = mongoose.model("User", userSchema);