import mongoose from "mongoose";

const walkinLogSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  timestamp: { type: Date, default: Date.now },
  estimatedCustomerCount: { type: Number, required: true },
});

const WalkInLog = mongoose.model("WalkInLog", walkinLogSchema);
export default WalkInLog;
