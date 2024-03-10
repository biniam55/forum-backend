const { StatusCodes } = require("http-status-codes")
const dbconnection = require ("../Dbconnection/dbconfig")
const postanswer = async (req,res)=>{
   const {answer,questionid} = req.body
   if(!answer||!questionid){
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"All fields are required"})
   }
   try{
    const [questions] = await dbconnection.query("SELECT * FROM questions WHERE questionid = ?", [questionid]);
    if (questions.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid question ID" });
    }
   }
   catch(error){
     console.error(error.message);
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Something went wrong while verifying question ID, try again later",error});
   }
    const userid = req.user.userid; 
    try {
        await dbconnection.query("INSERT INTO answers (answer, userid, questionid) VALUES (?, ?, ?)", [answer, userid, questionid]);
        return res.status(StatusCodes.CREATED).json({message: "Answer posted successfully"});
    } catch (error) {
        // console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Something went wrong, try again later"});
    }
}
const getanswer = async (req,res)=>{
    // Assuming the questionid is sent as a URL parameter and accessed by req.params.questionid
    const questionid = req.params.questionid;

    if (!questionid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Question ID is required"});

    }

    try {
        const [answer] = await dbconnection.query("SELECT * FROM answers JOIN users ON answers.userid = users.userid WHERE questionid = ?", [questionid]);
        
        if (answer.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No answers found for the given question ID" });
        }

        return res.status(StatusCodes.OK).json({ answer });

    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Something went wrong, try again later"});
    }
}
module.exports = {postanswer, getanswer}