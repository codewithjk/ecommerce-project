const express = require("express");
const router = express();
const { getLogin } = require("../controller/admin/auth");
const path = require("path");
//set admin views
router.set("views", path.join(__dirname, "../../views/admin"));

router.get("/login", getLogin);

module.exports = router;

console.log(__dirname);
