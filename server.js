const express = require("express");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const path = require("path");
const app = express();

connectDB();

//
app.use(
  express.json({
    extended: false,
  }),
);
app.use(fileUpload());
//

//define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

// Serve static assests in production

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
