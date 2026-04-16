import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    videoType: {
      type: String,
      enum: ["file", "link"],
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    videoUrl: { type: String, required: true },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
