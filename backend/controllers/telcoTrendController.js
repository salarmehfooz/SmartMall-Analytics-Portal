import TelcoTrend from "../models/TelcoTrend.js";
import User from "../models/User.js";

// 📥 Admin: Add a new TelcoTrend
export const createTelcoTrend = async (req, res) => {
  const { category, trendScore } = req.body;

  try {
    const trend = new TelcoTrend({
      category,
      trendScore,
      recordedAt: new Date(), 
    });

    await trend.save();
    res.status(201).json({ message: "Trend added successfully", trend });
  } catch (err) {
    res.status(500).json({ message: "Error adding trend", error: err.message });
  }
};

// 📄 Admin: Get all TelcoTrends sorted by trendScore descending (most trending first)
export const getAllTelcoTrends = async (req, res) => {
  try {
    const trends = await TelcoTrend.find().sort({ trendScore: -1 }); 
    res.status(200).json(trends);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching trends", error: err.message });
  }
};

// 👤 StoreManager: Get TelcoTrends for their store's category sorted by trendScore descending
export const getMyCategoryTrends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("store");

    if (!user || user.role !== "storeManager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const category = user.store.category;

    const trends = await TelcoTrend.find({ category }).sort({ trendScore: -1 });

    res.status(200).json(trends); 
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching trends", error: err.message });
  }
};
