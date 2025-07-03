const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(
  cors({
    origin: "http://192.168.18.131:5173", // ✅ frontend address
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRoutes);

app.get("/verify-token", (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;

  if (!token) {
    return res.status(401).send("Unauthorized: Please Login");
  }

  try {
    const decoded = jwt.verify(token, "DevTinder@9712");

    res.json({ message: "Token is valid", userId: decoded._id });
  } catch (error) {
    res.status(400).send("ERROR: Invalid token");
  }
});

app.patch("/test", (req, res) => {
  res.json({ message: "Test PATCH route works" });
});

connectDB()
  .then(() => {
    console.log("database connection is established");
    app.listen(port, "0.0.0.0", () => {
      console.log("server/app is listening on port 3000");
    });
  })
  .catch(() => {
    console.error("database cannot be connected");
  });
