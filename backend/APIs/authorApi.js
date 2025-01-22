const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const verifyToken=require('../Middlewares/verifyToken');
//get authorsCollection from server.js
authorApp.use((req,res,next)=>{
    authorsCollection=req.app.get('authorsCollection');
    articlesCollection=req.app.get('articlesCollection');
    next();
})
//import bcrypts
const bcryptjs=require('bcryptjs');
//import jsonwebtoken
const jwt=require('jsonwebtoken');

//request handler for author Registration
authorApp.post('/author',expressAsyncHandler(async(req,res)=>{
    const newUser=req.body;
    //comparing it with username
    const dbUser=await authorsCollection.findOne({username:newUser.username});
    if(dbUser!=null){
     res.send({message:"Author already registered"});
    }
    else{
     //hash the password
     const hashedPassword=await bcryptjs.hash(newUser.password,6);
     newUser.password=hashedPassword;
     //add it to the collection
     await authorsCollection.insertOne(newUser);
     res.send({message:"author registered"});
 
    }
 }))
require('dotenv').config();
//request handler for author Login
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //Get the user credentials
    const userCred=req.body;
    //compare or find user with the username
    const dbUser=await authorsCollection.findOne({username:userCred.username});
   
    //if dbuser is null
    if(dbUser===null){
        res.send({message:"user does not exist"})
    }
    else{
        //compare the hashed password
        const status=await bcryptjs.compare(userCred.password,dbUser.password);
        if(status===false){
            res.send({message:"Incorrect password"});
        }
        else{
            //create json web token
            const signedToken=jwt.sign({username:dbUser.username},"abcdef",{expiresIn:'1d'});
            //send the response
            res.send({message:"login success",token:signedToken,user:dbUser});

        }
    }
}))

//adding new article by author
authorApp.post('/article',verifyToken,(async(req,res)=>{
    //get new article
    
    const newArticle=req.body;
    //posting to articles collection
    await articlesCollection.insertOne(newArticle);
    //send response
    res.send({message:"New article created"});

    
}))

//request handler for updating an article by author
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get body from request 
    const modifiedArticle=req.body;
    //update article by articleid
    await articlesCollection.updateOne({articleId:modifiedArticle.articleId},{$set:modifiedArticle});
    let latestArticle=await articlesCollection.findOne({articleId:modifiedArticle.articleId})
    res.send({message:"Article is modified",article:latestArticle});
}))


//delete an article by article ID
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articleId from url
    const artileIdFromUrl=(+req.params.articleId);
    //get article 
    const articleToDelete=req.body;

    if(articleToDelete.status===true){
       let modifiedArt= await articlesCollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:"after"})
       res.send({message:"article deleted",payload:modifiedArt.status})
    }
    if(articleToDelete.status===false){
        let modifiedArt= await articlesCollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:"after"})
        res.send({message:"article restored",payload:modifiedArt.status})
    }
   
   
}))


//viewing articles of his own by author by his name
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get authorname from url
    const authorName=req.params.username;
    //get articles of author whose status is true
    const articlesList=await articlesCollection.find().toArray();
   //send the response
   res.send({message:"List of articles",payload:articlesList}); 
}))

module.exports=authorApp;