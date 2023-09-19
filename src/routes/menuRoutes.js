const express = require("express");
const router = express.Router();
 
const { getMenus, getSingleMenu, createMenus, editSingleMenu } = require("../controllers/menuController");

router.get("/menuitems", getMenus);
router.get("/menuitem/:id", getSingleMenu);
router.post("/menuitems", createMenus);
router.put("/menuitem/:id", editSingleMenu);

router.get("/admin", (req, res) => {
  res.send("We're in menu routes");
});

module.exports = router;
