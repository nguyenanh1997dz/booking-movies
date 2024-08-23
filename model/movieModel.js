const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Genre",
        },
      ],
    },
    view: {
      type: Number,
      default: 0,
    },
    cast: {
      type: [String],
    },
    director: {
      type: String,
    },
    image: {
      type: Object,
    },
    trailer: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: {
          type: Number,
          default: 0,
        },
        dislikes: {
          type: Number,
          default: 0,
        },
        likedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        dislikedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
    countRating: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Movie", movieSchema);
