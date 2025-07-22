import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "fashion", "electronics"
  floor: { type: String, required: true },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // Enforce one manager per store
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
