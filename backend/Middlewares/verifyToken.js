const jwt=require('jsonwebtoken');
require('dotenv').config();
function verifyToken(req,res,next){
    //get bearer token from headers 
    const bearerToken=req.headers.authorization;
    if(!bearerToken){
        return res.send({message:"unAuthorized access,please login to continue"})
    }
    else{
        //get token from bearer token
        const token=bearerToken.split(' ')[1];
        //verify the token
        try{
            jwt.verify(token,"abcdef");
            next();
        }
        catch(err){
            next(err);
        }
    }


}


module.exports=verifyToken;