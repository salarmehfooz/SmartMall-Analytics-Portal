import mongoose from "mongoose";

const telcoTrendSchema = new mongoose.Schema({
  category: { type: String, required: true }, 
  trendScore: { type: Number, required: true }, 
  recordedAt: { type: Date, default: Date.now },
});

const TelcoTrend = mongoose.model("TelcoTrend", telcoTrendSchema);
export default TelcoTrend;
