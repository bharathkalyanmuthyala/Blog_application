const exp=require('express')
const app=exp();
const path=require('path');
require('dotenv').config();
const port=4000;
//import the APIs into server.js
const userApp=require('../backend/APIs/userApi.js');
const authorApp=require('../backend/APIs/authorApi.js');
//to parse the body of JSON files or requests
app.use(exp.json());
//if the Request starts with userapi then direct to userApp
app.use('/userapi',userApp);
//if the Request starts with authorapi then direct to authorApp
app.use('/authorapi',authorApp);

//deploying react build in server
app.use(exp.static(path.join(__dirname,'../frontend/build')))

//avoiding refreshing of page
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})

//importing mongoclient
const mongoclient=require('mongodb').MongoClient;
//Making connection to the database
mongoclient.connect('mongodb://127.0.0.1:27017')
.then(client=>{
    //get database obj
    const blogg=client.db('blogg');
    //get collection from database
    const usersCollection=blogg.collection("usersCollection");
    const articlesCollection=blogg.collection("articlesCollection");
    const authorsCollection=blogg.collection("authorsCollection");
    //share collection object with express application
    app.set('usersCollection',usersCollection);
    app.set('articlesCollection',articlesCollection);
    app.set('authorsCollection',authorsCollection);
    //confirm db connection status
    console.log("DB connection successful")
})
.catch(err=>console.log("err in db connection",err));
//to handle errors
app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err.message})
})
//assigning port number
app.listen(port,()=>console.log(`server is running on port ${port}`));

