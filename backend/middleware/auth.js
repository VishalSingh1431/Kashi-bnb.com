import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { prisma } from '../utils/client.js';


//Checks if the user is logged in (has a valid JWT token).

const authorisation = async (req,res,nex)=>{
    // console.log(req.headers);
    try{
        let token = req.get('Authorization');

        if(!token){
            console.log("No token provided");
            return res.status(411).json({
                success : false,
                message : "no token",
            });
        }

        token = token.split(" ")[1];
        
        // console.log(token," tot ")
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }
        const decoded = await jwt.verify(token,jwtSecret);

        if(decoded){
            // Always fetch the latest user from DB to avoid stale token claims
            const dbUser = await prisma.users.findUnique({ where: { id: decoded.id } });

            if(!dbUser){
                console.log("User not found for token id");
                return res.status(401).json({
                    success: false,
                    message: "invalid token user"
                });
            }

            // Sanitize and attach fresh user to request
            const { password, token: userToken, ...safeUser } = dbUser;
            req.user = safeUser;
            nex();
        }
        else{
            console.log("invalid token");
            return res.status(411).json({
                success : false,
                message : "invalid token",
            });
        }
    }
    catch(e){
        console.log("JWT verification error:", e);
        return res.status(411).json({
            success : false,
            message : "auth error",
            e
        });
    }
};

//  Checks if the logged-in user is an admin.

const isAdmin = async (req,res,nex)=>{
    try
    {    
        const user= req.user;
        // console.log(user);
        if(user.is_admin==true){
            nex();
        }
        else{
            console.log("you are not an admin");
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

//  Checks if the user is a hotel owner.
const hasHotel = async (req,res,nex)=>{
    // console.log(req.body);
    try
    {    
        const user= req.user;
        if(user.has_hotel==true){
            nex();
        }
        else{
            console.log("you are not a hotel owner");
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

//  Checks if the user is a restaurant owner.
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


// Limits the number of requests a user can make in a short time (rate limiting).
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many requests, please try again later."
});

export {isAdmin,authorisation,hasHotel,hasRestr,limiter};