import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Store from "../models/Store.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "7d";

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 🟢 Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("store");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        store: user.store,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
export const registerAdmin = async (req, res) => {
  const { name, email, password, adminToken } = req.body;

  const SETUP_TOKEN = process.env.JWT_SECRET;

  if (adminToken !== SETUP_TOKEN) {
    return res.status(401).json({ message: "Invalid admin token" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    const token = generateToken(newAdmin);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Admin registration failed", error: err.message });
  }
};

// 🆕 Register StoreManager (Admin only)
export const registerStoreManager = async (req, res) => {
  const { name, email, password, storeId } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const existingManager = await User.findOne({
      store: storeId,
      role: "storeManager",
    });
    if (existingManager)
      return res.status(400).json({ message: "Store already has a manager" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "storeManager",
      store: storeId,
    });

    await newUser.save();

    store.manager = newUser._id;
    await store.save();

    res.status(201).json({
      message: "StoreManager registered successfully",
      userId: newUser._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// 🔐 JWT Auth Middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 🔐 Admin-Only Middleware
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// 🔐 StoreManager-Only Middleware
export const isStoreManager = (req, res, next) => {
  console.log("isStoreManager check, user role:", req.user?.role);
  if (req.user?.role !== "storeManager") {
    return res.status(403).json({ message: "StoreManager access required" });
  }
  next();
};
