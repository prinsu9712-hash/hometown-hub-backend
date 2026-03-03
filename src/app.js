const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

/* ================================
   GLOBAL MIDDLEWARE
================================ */

// Security headers
app.use(helmet());

// 🔥 PROPER CORS CONFIG
const corsOptions = {
  origin: [
    "http://localhost:3000", // frontend local
    "https://hometown-hub-backend.onrender.com" // backend domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

// Parse JSON body
app.use(express.json());

// Logging
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

/* ================================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/communities", require("./routes/communityRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================================
   ROOT ROUTE
================================ */

app.get("/", (req, res) => {
  res.send("Hometown Hub API Running 🚀");
});

/* ================================
   404 HANDLER
================================ */

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

module.exports = app;