const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const mathRoutes = require("./routes/mathRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Calclab backend funcionando",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/math", mathRoutes);

module.exports = app;