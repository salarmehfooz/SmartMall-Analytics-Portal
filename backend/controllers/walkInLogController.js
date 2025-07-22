import WalkInLog from "../models/WalkInLog.js";
import Store from "../models/Store.js";
import User from "../models/User.js";

// 🟢 StoreManager: Add walk-in log for their store
export const addWalkInLog = async (req, res) => {
  const { estimatedCustomerCount } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("store");
    if (!user || user.role !== "storeManager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const log = new WalkInLog({
      store: user.store._id,
      estimatedCustomerCount,
      timestamp: new Date(),
    });

    await log.save();

    res.status(201).json({ message: "Walk-in log recorded", log });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging walk-in", error: err.message });
  }
};

// 🔎 Admin: View all walk-in logs (optional: filter by store)
export const getAllWalkInLogs = async (req, res) => {
  const { storeId } = req.query;

  try {
    const filter = storeId ? { store: storeId } : {};
    const logs = await WalkInLog.find(filter).populate(
      "store",
      "name category floor"
    );
    res.status(200).json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: err.message });
  }
};

// 👤 StoreManager: View logs for their own store
export const getMyStoreLogs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("store");
    if (!user || user.role !== "storeManager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await WalkInLog.find({ store: user.store._id }).sort({
      timestamp: -1,
    });
    res.status(200).json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: err.message });
  }
};
