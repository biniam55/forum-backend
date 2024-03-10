const express = require("express")
const router = express.Router()
const midleware = require ("../midleware/authmidleware")
const {getanswer, postanswer} = require ("../controller/answerController")
router.get("/all-answers", midleware, (req, res) => {
    res.send("all all answers")
})
router.post("/oneanswer",midleware, postanswer)
router.get("/oneanswer/:questionid",midleware, getanswer)
module.exports = router