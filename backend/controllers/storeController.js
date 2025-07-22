import Store from "../models/Store.js";
import User from "../models/User.js";

// 📦 Create a new store
export const createStore = async (req, res) => {
  const { name, category, floor, managerId } = req.body;

  try {
    if (!floor || typeof floor !== "string") {
      return res.status(400).json({ message: "Floor must be a string" });
    }

    let manager = null;
    if (managerId) {
      manager = await User.findById(managerId);
      if (!manager || manager.role !== "storeManager") {
        return res.status(400).json({ message: "Invalid manager ID or role" });
      }

      const existingStore = await Store.findOne({ manager: managerId });
      if (existingStore) {
        return res.status(400).json({
          message: "This manager is already assigned to another store",
        });
      }
    }

    const store = new Store({
      name,
      category,
      floor, 
      manager: manager ? manager._id : undefined,
    });

    await store.save();

    if (manager) {
      manager.store = store._id;
      await manager.save();
    }

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error("Error creating store:", err);
    res
      .status(500)
      .json({ message: "Error creating store", error: err.message });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("manager", "name email").lean();

    const cleanedStores = stores.map((store) => ({
      ...store,
      _id: store._id.toString(),
      createdAt: store.createdAt.toISOString(),
      manager: store.manager
        ? { ...store.manager, _id: store.manager._id.toString() }
        : null,
    }));

    res.status(200).json(cleanedStores);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stores", error: err.message });
  }
};

// 🔍 Get store by ID
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate(
      "manager",
      "name email"
    );
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.status(200).json(store);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching store", error: err.message });
  }
};

// ✏️ Update store
export const updateStore = async (req, res) => {
  const { name, category, floor, managerId } = req.body;

  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    if (managerId && managerId !== store.manager.toString()) {
      // Validate new manager
      const manager = await User.findById(managerId);
      if (!manager || manager.role !== "storeManager") {
        return res.status(400).json({ message: "Invalid manager ID or role" });
      }

      // Check if new manager already assigned
      const isAssigned = await Store.findOne({ manager: managerId });
      if (isAssigned && isAssigned._id.toString() !== store._id.toString()) {
        return res
          .status(400)
          .json({ message: "Manager already assigned to another store" });
      }

      // Update old manager
      const oldManager = await User.findById(store.manager);
      if (oldManager) {
        oldManager.store = undefined;
        await oldManager.save();
      }

      // Assign new manager
      manager.store = store._id;
      await manager.save();

      store.manager = managerId;
    }

    store.name = name ?? store.name;
    store.category = category ?? store.category;
    store.floor = floor ?? store.floor;

    await store.save();

    res.status(200).json({ message: "Store updated successfully", store });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating store", error: err.message });
  }
};

// ❌ Delete store
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Unlink manager
    const manager = await User.findById(store.manager);
    if (manager) {
      manager.store = undefined;
      await manager.save();
    }

    await store.deleteOne();

    res.status(200).json({ message: "Store deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting store", error: err.message });
  }
};
