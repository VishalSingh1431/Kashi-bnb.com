import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const authorisation = async (req,res,nex)=>{
    try{
        const token = req.get('Authorization').split(" ")[1];
        if(!token){
            return res.status(411).json({
                message : "no token",
            });
        }
        const user=await jwt.verify(token,process.env.JWT_SEX);
        req.body.user=user;
        if(user){
            nex();
        }
        else{
            return res.status(411).json({
                message : "invalid token",
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            message : "auth error",
            e
        });
    }
};

const isAdmin = async (req,res,nex)=>{
    try
    {    
        const user= req.body.user;
        console.log(user);
        if(user.is_admin==true){
            nex();
        }
        else{
            return res.status(411).json({
                message:" not admin"
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            message:" error geting data",
            e
        });
    
    }
};

const hasHotel = async (req,res,nex)=>{
    try
    {    
        const user= req.body.user;
        if(user.has_hotel==true){
            nex();
        }
        else{
            return res.status(411).json({
                message:" no hoteler"
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            message:" error geting data",
            e
        });

    }
};
const hasRestr = async (req,res,nex)=>{
    try
    {    
        const user= req.body.user;
        if(user.has_restr==true){
            nex();
        }
        else{
            return res.status(411).json({
                message:" no rester"
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            message:" error geting data",
            e
        });
    
    }
};

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later."
});

export {isAdmin,authorisation,hasHotel,hasRestr,limiter};