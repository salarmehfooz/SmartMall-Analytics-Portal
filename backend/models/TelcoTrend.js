import mongoose from "mongoose";

const telcoTrendSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Matches Store.category
  trendScore: { type: Number, required: true }, // e.g., 1–100 or a float
  recordedAt: { type: Date, default: Date.now },
});

const TelcoTrend = mongoose.model("TelcoTrend", telcoTrendSchema);
export default TelcoTrend;
