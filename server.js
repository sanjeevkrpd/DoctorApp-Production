const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectToDb = require("./config/db");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");
const path = require("path");
// const cors = require('cors');
// dotenv config
dotenv.config();

//mongo
connectToDb();

//rest objects

const app = express();

//middlewares

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/doctor", doctorRoute);
app.get("/", (req, res) => {
  res.status(200).send({
    message: "server running",
  });
});

//static files
app.use(express.static(path.join(__dirname, "./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is listining to the port ${port}`.green.bgCyan);
});
