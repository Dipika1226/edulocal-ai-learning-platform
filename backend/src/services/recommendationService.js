import Video from "../models/Video.js";
import WatchHistory from "../models/WatchHistory.js";

/**
 * Recommendation Service
 *
 * Implements a simple hybrid recommendation system:
 *   A) Content-based filtering  – keyword similarity between watched and candidate videos
 *   B) Behavior-based filtering – boost videos similar to recently watched ones
 *   C) Fallback                 – latest + most-viewed public videos for new users
 *
 * Algorithm overview:
 *   1. Pull the user's watch history (last 50 entries).
 *   2. Build a "user interest profile" from the keywords of watched videos.
 *   3. Score every public video the user has NOT watched:
 *        score = keywordOverlap * contentWeight
 *              + recencyBonus  (newer videos get a small boost)
 *   4. Sort by score descending, then by createdAt descending as tiebreaker.
 *   5. If the user has no history → return latest public videos (cold-start fallback).
 */

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/**
 * Extract meaningful keywords from a string.
 * Filters out very short words and numbers.
 */
const extractKeywords = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && Number.isNaN(Number(word)));

/**
 * Build a keyword-frequency map from a video's title, description,
 * topic labels, and insights summary.
 */
const getVideoKeywords = (video) => {
  const parts = [
    video.title || "",
    video.description || "",
    video.insightsSummary || "",
    ...(video.topics || []).map((t) => t.label || ""),
    ...(video.topics || []).map((t) => t.summary || ""),
  ];

  return extractKeywords(parts.join(" "));
};

/**
 * Compute the number of overlapping keywords between two arrays.
 */
const computeKeywordOverlap = (profileKeywords, videoKeywords) => {
  const profileSet = new Set(profileKeywords);
  let overlap = 0;

  for (const word of videoKeywords) {
    if (profileSet.has(word)) {
      overlap += 1;
    }
  }

  return overlap;
};

/**
 * Compute a small recency bonus so newer videos surface higher
 * when keyword scores are tied.
 * Returns a value between 0 and 1 (1 = brand new, ~0 = very old).
 */
const recencyScore = (createdAt) => {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  // Decay over ~90 days
  return Math.max(0, 1 - ageDays / 90);
};

// ──────────────────────────────────────────────
// Main function
// ──────────────────────────────────────────────

/**
 * Get recommended videos for a given user.
 *
 * @param {string} userId – Mongoose ObjectId of the logged-in user
 * @param {number} limit  – Max number of recommendations to return
 * @returns {Array}       – Sorted array of recommended Video documents
 */
export const getRecommendedVideos = async (userId, limit = 20) => {
  // 1. Fetch all public videos
  const allPublicVideos = await Video.find({ isPublic: true }).sort({
    createdAt: -1,
  });

  if (allPublicVideos.length === 0) {
    return [];
  }

  // 2. Fetch user watch history (most recent 50)
  const history = await WatchHistory.find({ userId })
    .sort({ watchedAt: -1 })
    .limit(50)
    .lean();

  // ── Cold-start fallback ──────────────────────
  if (!history || history.length === 0) {
    // New user: return latest public videos
    return allPublicVideos.slice(0, limit);
  }

  // 3. Build a set of already-watched video IDs
  const watchedIds = new Set(history.map((h) => h.videoId.toString()));

  // 4. Build user interest profile from watched videos
  const watchedVideos = allPublicVideos.filter((v) =>
    watchedIds.has(v._id.toString())
  );

  // Also consider the user's own private videos they watched
  if (watchedVideos.length === 0) {
    const privateWatched = await Video.find({
      _id: { $in: [...watchedIds] },
    }).lean();

    watchedVideos.push(...privateWatched);
  }

  // Aggregate all keywords from watched videos into a profile
  const profileKeywords = [];
  for (const video of watchedVideos) {
    profileKeywords.push(...getVideoKeywords(video));
  }

  // 5. Score each candidate video
  const scored = allPublicVideos.map((video) => {
    const videoId = video._id.toString();
    const wasWatched = watchedIds.has(videoId);

    // Content-based score: keyword overlap with user profile
    const videoKw = getVideoKeywords(video);
    const overlap = computeKeywordOverlap(profileKeywords, videoKw);

    // Normalize by the length of the video's keywords to avoid bias
    // toward videos with very long descriptions
    const contentScore =
      videoKw.length > 0 ? overlap / Math.sqrt(videoKw.length) : 0;

    // Recency bonus
    const recency = recencyScore(video.createdAt);

    // Already-watched penalty: push watched videos lower so user
    // sees fresh content first, but still include them
    const watchedPenalty = wasWatched ? 0.3 : 1.0;

    // Final combined score
    const finalScore = (contentScore * 3 + recency) * watchedPenalty;

    return {
      video,
      score: finalScore,
    };
  });

  // 6. Sort by score descending, then by createdAt descending
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.video.createdAt) - new Date(a.video.createdAt);
  });

  // 7. Return the top N videos
  return scored.slice(0, limit).map((item) => item.video);
};

/**
 * Record that a user watched a video.
 * Updates existing entry or creates a new one.
 *
 * @param {string} userId        – Mongoose ObjectId
 * @param {string} videoId       – Mongoose ObjectId
 * @param {number} watchDuration – Seconds watched (optional)
 */
export const recordWatch = async (userId, videoId, watchDuration = 0) => {
  // Upsert: update the timestamp and duration if user watched again
  await WatchHistory.findOneAndUpdate(
    { userId, videoId },
    {
      $set: {
        watchedAt: new Date(),
        watchDuration,
      },
    },
    { upsert: true, new: true }
  );
};
