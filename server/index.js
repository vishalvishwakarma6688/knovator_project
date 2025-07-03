const express = require("express");
const mongoose = require("mongoose");
const fetchAndQueueJobs = require("./services/jobFetcher")
const importLogsRoute = require("./routes/importLogs")
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.errpr("Mongodb connection error", err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Serving is running on port ", PORT);
});

fetchAndQueueJobs();

setInterval(()=>{
  console.log("Hourly Fetch Triggered")
  fetchAndQueueJobs()
}, 60 * 60 * 1000)

app.use("/api/import-logs", importLogsRoute)