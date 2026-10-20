require("dotenv").config();

// Fail early with a clear message if the environment is not set up
const missing = ["DATABASE_URL", "JWT_SECRET"].filter((name) => !process.env[name]);
if (missing.length > 0) {
    console.error(
        `Missing environment variables: ${missing.join(", ")}. Copy .env.example to .env and fill it in.`
    );
    process.exit(1);
}

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const favoriteRoutes = require("./routes/favorites");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", authRoutes);
app.use("/api", favoriteRoutes);
app.use("/api/recipes", recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error("Could not start server:", err.message);
        process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
});