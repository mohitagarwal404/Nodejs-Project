const express = require("express");
const { signup, login } = require("../controller/auth");
const {getProfile, updateProfile} = require("../controller/user")

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/get-profile", getProfile)
router.post("/update-profile", updateProfile)

module.exports = router;
