const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getSingleCustomer,
  createCustomers,
  loginCustomer,
} = require("../controllers/customerController");

router.get("/customers", getCustomers);
router.get("/customer/:id", getSingleCustomer);
router.post("/customer", createCustomers);
router.post("/login", loginCustomer);

router.get("/admin", (req, res) => {
  res.send("We're in customer route");
});

module.exports = router;
