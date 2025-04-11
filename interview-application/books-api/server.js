const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json()); 

mongoose.connect("[Your MongoDB Connection String Here :)]", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.log("MongoDB connection error:", error));

const booksRouter = require("./routes/books");
app.use("/api/books", booksRouter);

const PORT = process.env.PORT || 3750;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
