import mongoose from "mongoose";

/**
 * WatchHistory Model
 * Tracks which videos each user has watched, along with timestamps
 * and watch duration. Used by the recommendation engine.
 */
const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
    watchDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookups by user + video
watchHistorySchema.index({ userId: 1, videoId: 1 });

// Index for sorting by recency per user
watchHistorySchema.index({ userId: 1, watchedAt: -1 });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

export default WatchHistory;
