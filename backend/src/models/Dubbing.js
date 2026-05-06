import mongoose from "mongoose";

const dubbingSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dubLanguage: {
      type: String,
      enum: ["Hindi", "English", "Marathi"],
      required: true,
    },
    transcript: {
      type: String,
      default: "",
    },
    translatedText: {
      type: String,
      default: "",
    },
    dubbedAudioUrl: {
        type: String,
        default: "",
    },
    dubbedVideoUrl: {
        type: String,
        default: "",
    },
    processingStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
    },
},
    { timestamps: true }
);

const Dubbing = mongoose.model("Dubbing", dubbingSchema);

export default Dubbing;