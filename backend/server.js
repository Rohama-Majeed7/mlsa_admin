require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Admin = require("./models/Admin");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const teamRoutes = require("./routes/team");

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL_mlsa_admin || "https://localhost:3000",
      process.env.FRONTEND_URL_mlsa_site || "https://localhost:5173",
    ],

  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/team", teamRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "MLSA API is running" });
});

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@mlsa.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const exists = await Admin.findOne({ email });
  if (!exists) {
    await Admin.create({ email, password });
    console.log(`Default admin created: ${email}`);
  }
}

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mlsa";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
