import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const authorisation = async (req,res,nex)=>{
    // console.log(req.body);
    try{
        const token = req.get('Authorization').split(" ")[1];
        if(!token){
            return res.status(411).json({
                success : false,
                message : "no token",
            });
        }
        const user=await jwt.verify(token,process.env.JWT_SEX);
        if(user){
            req.user=user;
            nex();
        }
        else{
            return res.status(411).json({
                success : false,
                message : "invalid token",
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            success : false,
            message : "auth error",
            e
        });
    }
};

const isAdmin = async (req,res,nex)=>{
    try
    {    
        const user= req.user;
        console.log(user);
        if(user.is_admin==true){
            nex();
        }
        else{
            return res.status(411).json({
                success : false,
                message:" not admin"
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            success : false,
            message:" error geting data",
            e
        });
    
    }
};

const hasHotel = async (req,res,nex)=>{
    // console.log(req.body);
    try
    {    
        const user= req.user;
        if(user.has_hotel==true){
            nex();
        }
        else{
            return res.status(411).json({
                success : false,
                message:" no hoteler"
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            success : false,
            message:" error geting data",
            e
        });

    }
};

const hasRestr = async (req,res,nex)=>{
    try
    {    
        const user= req.user;
        if(user.has_restr==true){
            nex();
        }
        else{
            return res.status(411).json({
                success : false,
                message:" no rester"
            });
        }
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            success : false,
            message:"error geting data",
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