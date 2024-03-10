const {StatusCodes} = require("http-status-codes")
const { v4: uuidv4 } = require('uuid')
const dbconnection = require("../Dbconnection/dbconfig")
const postquestion = async (req,res) =>{
    const uniqueId = uuidv4();
    const {title, description} = req.body;
    if(!title||!description){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"all fields are required"})
    }
    if (!req.user || !req.user.userid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "User not authenticated" });
    }
    const userid = req.user.userid;
    try{
        await dbconnection.query("insert into questions(title,description,userid,questionid) values (?,?,?,?)",[title,description,userid,uniqueId])
        return res.status(StatusCodes.CREATED).json({msg:"question successfully posted"})
    }
    catch(error){
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something went wrong", error})
    }

}

const getquestion = async (req,res)=>{
    try {
        const [questions] = await dbconnection.query(  "SELECT * FROM questions JOIN users ON questions.userid = users.userid ");
        return res.status(StatusCodes.OK).json({ questions });

    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong try again later"});
    }
}
module.exports = {postquestion,getquestion}