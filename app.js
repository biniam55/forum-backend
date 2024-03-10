const express = require('express');
const app = express();
const port = 5500;
app.use(express.json());
const dbconnect = require('./Dbconnection/dbconfig');
const userRoute = require('./routes/userroute')
const questionroute = require('./routes/questionRoute');
const answerroute = require('./routes/answerRoute');
const authmidleware = require('./midleware/authmidleware');
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors())
require('dotenv').config();


async function start () {
    try{
        const result = await dbconnect.execute("select 'test'")
        console.log(`listening on port ${port}`)
        console.log("database connection successfully established")
        // console.log(result)
    }
    catch(error){
    console.log(error.message)
    }
}
start()

app.use('/api/users', userRoute)
app.use ('/api/questions',authmidleware, questionroute)
app.use('/api/answers',  answerroute)
app.listen(port)