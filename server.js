const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const contactRoutes = require("./backend/Routes/contactRoutes");
const analyzeRoutes = require("./backend/Routes/analyzeRoutes");
const { testDbConnection, printDbConfig } = require("./backend/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("./frontend"));

app.use("/contact", contactRoutes);
app.use("/analyze", analyzeRoutes);

testDbConnection();
printDbConfig();

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});