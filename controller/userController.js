const dbconnect = require('../Dbconnection/dbconfig')
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const register = async (req,res)=>{
   const {username, firstname, lastname, email, password} = req.body
   if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
 } try {
    const [user] = await dbconnect.query("select username,userid from users where username=? or email=?", [username, email])
    // console.log(user)
    if (user.length > 0) {
     return res.status(StatusCodes.BAD_REQUEST).json({ message: "user already registered" })
    }
    if (password.length <= 8) {
       return res.status(StatusCodes.BAD_REQUEST).json({ message: "password should be greater than 8" })
    }      
    const hashedPassword = await bcrypt.hash(password, 10)
    await dbconnect.query("insert into users (username,firstname,lastname,email,password) values(?,?,?,?,?)", [username, firstname, lastname, email, hashedPassword])
    return res.status(StatusCodes.CREATED).json({ message: "All datas are successfully registersd" })

} catch (error) {
// console.log(error.message)
return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong try again later" })
}
 }

const login = async (req,res)=>{
    const {email,password} = req.body
    
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({message:"all fields are required"})
    }
    try {
        const [user] = await dbconnect.query("select username,userid,password from users where email=?", [email])

        if (user.length == 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid credintial" }) 
        }
        const isMatch = await bcrypt.compare(password, user[0].password)

        if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({message:"password not much"})
        }

        //generating token
        const username = user[0].username
        const userid = user[0].userid
        const token = jwt.sign({username,userid},process.env.JWT_Token,{expiresIn:"1d"})
        return res.status(StatusCodes.OK).json({msg:"user regisitered successfully",token: token,username:username});
        
    } catch (error) {
    // console.log(error.message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong try again later"})
    }
}
const checkUser = async (req,res)=>{
    const username = req.user.username
    const userid = req.user.userid  
    res.status(StatusCodes.OK).json({msg:"this user is valid user ", username:username , userid:userid})
}
module.exports = {register, login, checkUser}