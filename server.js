const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

dotenv.config();
// const connectionUrl = "mongodb+srv://shaikhshafique966566:Pass123@cluster0.akczpya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "mongodb://localhost:27017/Turfmanagement";


const connectionUrl =  "mongodb://localhost:27017";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/RoleRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const attributeRoutes = require("./routes/attributeRoutes");
const { setupSwagger } = require("./swagger");

const InitialSetupWizard = require("./models/setupWizard");

const app = express();

app.use(express.json());
app.use(cors());

// Setup Swagger Documentation
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", cartRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/attribute", attributeRoutes);

app.use("/init", (req, res) => {
  InitialSetupWizard()
    .then(() => {
      res.send("working");
    })
    .catch((err) => {
      res.status(500).json({ message: "Init failed", error: err.message });
    });
});

// Connect to MongoDB
mongoose
  .connect(connectionUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/api-docs`);
});

