const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const connectionUrl = "mongodb+srv://shaikhshafique966566:Pass123@cluster0.akczpya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "mongodb://localhost:27017/Turfmanagement";

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/RoleRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const InitialSetupWizard = require("./models/setupWizard");

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", cartRoutes);
app.use("/api/category", categoryRoutes);



app.use("/init", (req, res) => {
  InitialSetupWizard().then(() => {
    res.send("working");
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
});
