/** @format */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRouter.js";
import taskRouter from "./router/taskRouter.js";
dotenv.config();

const app = express();

// ✅ Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://taskflow-frontend.vercel.app/api"],
    credentials: true,
  })
);
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Hello World from backend!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server is running on port ${PORT}`);
});
