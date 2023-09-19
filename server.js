const express = require("express");
const adminRoutes = require("./src/routes/adminRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const menuRoutes = require("./src/routes/menuRoutes");

const app = express();
const PORT = 8080;
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use("/api", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
  console.log(`We're here in port ${PORT}`);
});
