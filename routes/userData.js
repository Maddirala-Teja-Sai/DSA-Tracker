const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Helper to convert Mongoose Maps to plain Objects
function formatTrackerData(data) {
  if (!data) return {};
  return {
    solved: data.solved || [],
    starred: data.starred || [],
    notes: data.notes instanceof Map ? Object.fromEntries(data.notes) : data.notes || {},
    solvedDates: data.solvedDates instanceof Map ? Object.fromEntries(data.solvedDates) : data.solvedDates || {},
    activity: data.activity instanceof Map ? Object.fromEntries(data.activity) : data.activity || {},
    customQuestions: data.customQuestions || [],
  };
}

// ─── Get User Tracker Data ───
router.get("/data", requireAuth, async (req, res) => {
  try {
    const data = formatTrackerData(req.user.trackerData);
    res.json({
      success: true,
      data,
      updatedAt: req.user.updatedAt,
    });
  } catch (err) {
    console.error("Get user data error:", err);
    res.status(500).json({ error: "Failed to fetch user tracker data" });
  }
});

// ─── Save / Update User Tracker Data ───
router.put("/data", requireAuth, async (req, res) => {
  try {
    const { solved, starred, notes, solvedDates, activity, customQuestions } = req.body;

    if (solved && Array.isArray(solved)) {
      req.user.trackerData.solved = solved;
    }
    if (starred && Array.isArray(starred)) {
      req.user.trackerData.starred = starred;
    }
    if (notes && typeof notes === "object") {
      req.user.trackerData.notes = new Map(Object.entries(notes));
    }
    if (solvedDates && typeof solvedDates === "object") {
      req.user.trackerData.solvedDates = new Map(Object.entries(solvedDates));
    }
    if (activity && typeof activity === "object") {
      req.user.trackerData.activity = new Map(Object.entries(activity));
    }
    if (customQuestions && Array.isArray(customQuestions)) {
      req.user.trackerData.customQuestions = customQuestions;
    }

    await req.user.save();

    res.json({
      success: true,
      message: "Data saved to cloud",
      savedAt: req.user.updatedAt,
    });
  } catch (err) {
    console.error("Save user data error:", err);
    res.status(500).json({ error: "Failed to save tracker data" });
  }
});

// ─── Merge Local Progress Into Account (Upon Login) ───
router.post("/sync-local", requireAuth, async (req, res) => {
  try {
    const local = req.body || {};
    const cloud = req.user.trackerData || {};

    // 1. Merge solved
    const mergedSolved = Array.from(
      new Set([...(cloud.solved || []), ...(local.solved || [])])
    );

    // 2. Merge starred
    const mergedStarred = Array.from(
      new Set([...(cloud.starred || []), ...(local.starred || [])])
    );

    // 3. Merge notes
    const cloudNotes = cloud.notes instanceof Map ? Object.fromEntries(cloud.notes) : cloud.notes || {};
    const localNotes = local.notes || {};
    const mergedNotes = { ...localNotes, ...cloudNotes };

    // 4. Merge solvedDates
    const cloudDates = cloud.solvedDates instanceof Map ? Object.fromEntries(cloud.solvedDates) : cloud.solvedDates || {};
    const localDates = local.solvedDates || {};
    const mergedDates = { ...localDates, ...cloudDates };

    // 5. Merge activity
    const cloudActivity = cloud.activity instanceof Map ? Object.fromEntries(cloud.activity) : cloud.activity || {};
    const localActivity = local.activity || {};
    const mergedActivity = { ...localActivity };
    for (const [date, count] of Object.entries(cloudActivity)) {
      mergedActivity[date] = Math.max(mergedActivity[date] || 0, count || 0);
    }

    // 6. Merge custom questions (deduplicated by id)
    const existingIds = new Set((cloud.customQuestions || []).map((q) => q.id));
    const mergedCustom = [...(cloud.customQuestions || [])];
    for (const q of local.custom || local.customQuestions || []) {
      if (!existingIds.has(q.id)) {
        existingIds.add(q.id);
        mergedCustom.push(q);
      }
    }

    // Save back to user
    req.user.trackerData.solved = mergedSolved;
    req.user.trackerData.starred = mergedStarred;
    req.user.trackerData.notes = new Map(Object.entries(mergedNotes));
    req.user.trackerData.solvedDates = new Map(Object.entries(mergedDates));
    req.user.trackerData.activity = new Map(Object.entries(mergedActivity));
    req.user.trackerData.customQuestions = mergedCustom;

    await req.user.save();

    res.json({
      success: true,
      message: "Local progress merged with cloud account",
      data: formatTrackerData(req.user.trackerData),
    });
  } catch (err) {
    console.error("Sync local data error:", err);
    res.status(500).json({ error: "Failed to merge local data" });
  }
});

module.exports = router;
