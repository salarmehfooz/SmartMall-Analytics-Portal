import Store from "../models/Store.js";
import TelcoTrend from "../models/TelcoTrend.js";
import WalkInLog from "../models/WalkInLog.js";

export const generateRecommendations = async (req, res) => {
  try {
    const recentTrends = await TelcoTrend.find({
      trendScore: { $gte: 70 },
    });

    const stores = await Store.find().populate("manager");

    const recommendations = [];

    for (let store of stores) {
      let storeRecs = [];

      // Match trends with store category
      const matchingTrend = recentTrends.find(
        (trend) => trend.category === store.category
      );

      if (matchingTrend) {
        storeRecs.push(
          `High interest in ${store.category}. Promote bestsellers or new arrivals.`
        );
      }

      // Walk-in analysis: average in past 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const walkIns = await WalkInLog.find({
        store: store._id,
        timestamp: { $gte: oneWeekAgo },
      });

      const avgWalkIn =
        walkIns.reduce((sum, log) => sum + log.estimatedCustomerCount, 0) /
        (walkIns.length || 1);

      if (avgWalkIn > 50) {
        storeRecs.push(
          `High average footfall (${Math.round(
            avgWalkIn
          )} visitors/day). Consider a flash sale or loyalty program.`
        );
      }

      if (storeRecs.length) {
        recommendations.push({
          store: store.name,
          floor: store.floor,
          category: store.category,
          suggestions: storeRecs,
        });
      }
    }

    res.status(200).json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
