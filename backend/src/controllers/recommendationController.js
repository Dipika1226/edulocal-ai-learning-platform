import {
  getRecommendedVideos,
  recordWatch,
} from "../services/recommendationService.js";

/**
 * GET /api/recommendations
 * Returns personalized video recommendations for the logged-in user.
 */
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 20;

    const videos = await getRecommendedVideos(userId, limit);

    res.json({ videos });
  } catch (error) {
    console.log("Recommendation error:", error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};

/**
 * POST /api/recommendations/watch
 * Records that the authenticated user watched a video.
 * Body: { videoId, watchDuration? }
 */
export const trackWatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId, watchDuration } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }

    await recordWatch(userId, videoId, watchDuration || 0);

    res.json({ message: "Watch recorded" });
  } catch (error) {
    console.log("Track watch error:", error);
    res.status(500).json({ message: "Failed to record watch" });
  }
};
