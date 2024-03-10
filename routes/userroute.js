const authmidleware = require("../midleware/authmidleware")
const express = require('express');
const app = express();
const router = express.Router();

const { register, login, checkUser} = require('../controller/userController');

router.post("/register", register )
router.post("/login",login)
router.get("/check",authmidleware, checkUser)

module.exports = router
