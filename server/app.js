const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", (err) => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});
app.get("/", (req, res) => {
  res.send("Welcome");
});

require("./models/user");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
