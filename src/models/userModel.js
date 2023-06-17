const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true,
    },

    phone: {
        type: String,
        required: true,
        unique: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);