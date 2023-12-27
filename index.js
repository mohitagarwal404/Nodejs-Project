const express = require("express");
const { connectToDatabase } = require("./model/mongoConnection");
const router = require("./routes/router");

const app = express();
const port = process.env.PORT || 8000;


// Middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running fine");
});

app.use("/api", router);

// Connect to MongoDB before starting the server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
