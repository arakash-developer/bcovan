require("dotenv").config();
const path = require("node:path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const databaseConnect = require("./app/database/mongodb");
const routes = require("./app/routes");
const http = require("http");
const cors = require("cors");
const app = express();
const port = process.env.APP_PORT;
const server = http.createServer(app);
const cookieSecretKey = process.env.COOKIE_SECRET_KEY;

// Enable case-sensitive routing
app.enable("case sensitive routing");

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const corsOptions = {
  origin: [
    "https://scovan.vercel.app",
    "https://covan.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  optionsSuccessStatus: 200,
};

// Cors site permission
app.use(cors(corsOptions));

// Using cookie-parser middleware with a secret key
app.use(cookieParser(cookieSecretKey));

// Define rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per window minute
  headers: true, // send X-RateLimit-Limit header
});

// Apply the rate limiter to all requests
app.use(limiter);

// All request data format is JSON
app.use(express.json());

// DB Connection
databaseConnect();

// Access all Images
app.use('/api/v1/frontend/public/images', express.static(path.join(__dirname, 'public/images')));

// All api route
app.use(routes);

app.get("/home", (req, res) => {
  res.send("Hello World!");
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ error: "The requested URL was not found." });
});

// Server side error handler
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ error: "There was an upload Error." });
    } else {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(500).json({ error: "There was an server-side Error." });
  }
});

server.listen(port, () => {
  console.log(`My App listening On Port http://localhost:${port}`);
});
