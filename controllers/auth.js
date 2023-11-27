const express = require("express");
const register = require("../public/js/register");
const login = require("../public/js/login");
const logout = require("./logout");
const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);

module.exports = router;