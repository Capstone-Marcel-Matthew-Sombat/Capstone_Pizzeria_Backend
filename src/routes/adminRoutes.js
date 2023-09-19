const express = require("express");
const router = express.Router();
const {
  getAdmin,
  getSingleAdmin,
  newAdmin,
  login,
} = require("../controllers/adminController");

router.get("/admin", getAdmin);
router.get("/admin/:id", getSingleAdmin);
router.post("/admin", newAdmin);
router.post("/login", login);

router.get("/admin", (req, res) => {
  res.send("We're in admin routes");
});

module.exports = router;
