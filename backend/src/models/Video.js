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

    videoUrl: { type: String, required: true },
    learningLanguage: { type: String, default: "English" },
    originalTranscript: { type: String, default: "" },
    transcript: { type: String, default: "" },
    topics: [
      {
        label: { type: String, required: true },
        timestamp: { type: Number, required: true, min: 0 },
        summary: { type: String, default: "" },
      },
    ],
    notes: [{ type: String }],
    insightsStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "skipped"],
      default: "pending",
    },
    insightsSummary: { type: String, default: "" },
    processingError: { type: String, default: "" },
    processedAt: { type: Date },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
