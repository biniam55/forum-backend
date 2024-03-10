const express = require ("express")
const authmidleware = require("../midleware/authmidleware")
const router = express.Router()

const { postquestion, getquestion } = require("../controller/questionController")
router.get("/all-questions",authmidleware,(req,res)=>{
    res.send("this is the question route")
})
router.post("/onequestion", postquestion)
router.get("/allquestion", getquestion)
module.exports = router