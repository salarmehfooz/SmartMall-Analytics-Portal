import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  floor: { type: String, required: true },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, 
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
