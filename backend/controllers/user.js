import { prisma } from '../utils/client.js';
import cryptoRandomString from 'crypto-random-string';
import { sendEmail } from '../utils/mail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginControl = async (req, res, nex) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please check your email or sign up."
            });
        }

        if (user.verified === false) {
            return res.status(403).json({
                success: false,
                message: "Email not verified. Please verify your email before logging in."
            });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password. Please try again."
            });
        }

        const token = await jwt.sign(user, process.env.JWT_SEX);
        user.password = null;
        user.token = null;
        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token: `Bearer ${token}`,
            user
        });
    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in.",
            error: e.message || e
        });
    }
};

export const verification = async (req,res,nex)=>{
    try{
        const token = req.query.token;
        const email = req.query.email;
        if(!token||!email){
            return res.status(411).json({
                success : false ,
                message:"no token",
            });
        }
        
        // console.log("token ver : ",token);

        const user = await prisma.users.findUnique({
            where : {
                email : email,
            }
        });
        
        // console.log(user);

        if(user.token === token){
            const user = await prisma.users.update({
                where : {
                    email : email,
                },
                data : {
                    token : null,
                    verified : true
                }
            });
            
            return res.status(200).json({
                success : true,
                message : "verified login to continue",
                // user 
            });
        }
        else{
            return res.status(411).json({
                success : false ,
                message:"invalid token",
                e
            });
        }

    }
    catch(e){
        return res.status(411).json({
            success : false ,
            message:"cant verify",
            e
        });
    }
}

export const signupControl = async (req,res,nex)=>{
    try{
        let user = await prisma.users.findUnique({
            where:{
                email : req.body.email
            }
        });

        if((user)&&(user.verified===true)){
            return res.status(420).json({
                success : false ,
                message : "user already exist",
            })
        }

        const token = cryptoRandomString({length:15});
        // console.log("token is : ",token);
        req.body.password= await bcrypt.hash(req.body.password,10);
        // console.log("salt",req.body.password);
        if(!user){
            user = await prisma.users.create({
                data: {
                    ...req.body,
                    token: token,
                }
            });
        }
        else{
            await prisma.users.update({
                where:{
                    email: req.body.email
                },
                data:{
                    name:req.body.name,
                    password : req.body.password,
                    token: token,
                }
            })
        }

        await sendEmail(req.body.email,token);

        return res.status(201).json({
            success : true,
            message:"verify user to finsish",
        })
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            success : false ,
            message:"unable to signup",
            e
        });
    }
}

export const checkControl = (req,res,nex)=>{
    return res.status(200).json({
        success : true,
        message:"route working"
    });
}

export const makeRequest = async (req, res, next) => {
    try {
        if (req.user.has_hotel === true) {
            console.log(req.user.email, "already hoteler");
            return res.status(420).json({
                success: false,
                message: "User is already a hotel owner."
            });
        }

        const existingRequest = await prisma.requests.findFirst({
            where: {
                userId: req.user.id,
                type: "hotelowner"
            }
        });

        if (existingRequest) {
            console.log(req.user.email, "already requested");
            return res.status(420).json({
                success: false,
                message: "request already exists"
            });
        }

        await prisma.requests.create({
            data: {
                ...req.body,
                type: "hotelowner",
                userId: req.user.id
            }
        });

        return res.status(200).json({
            success: true,
            message: "request created"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "error creating request",
            error: e.message
        });
    }
};

export const sendProfile = async (req,res,nex)=>{
    try{
        const reqId = req.params.uid;
        if(reqId!=req.user.id){
            return res.status(420).json({
                success : false ,
                message : "accessing different profile",
            })
        }
        const allData = await prisma.users.findUnique({
            where: {
              id: req.user.id
            },
            include: {
              bookings: true,
              hotels_name: {
                include: {
                  bookings: true
                }
              },
              restr_name: true,
              blogs_name: true
            }
          });
        allData.password=null;
        allData.token=null;
        return res.status(200).json({
            success : true,
            message : "profile got",
            allData
        })
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false ,
            message : "error getting profile",
            e
        })
    }
    
}

export const updateProfile = async (req,res,nex)=>{
    try{
        await prisma.users.update({
            where: {
              id: req.user.id
            },
            data:{
                ...req.body
            }
            
          });
        return res.status(200).json({
            success : true,
            message : "profile updated",
        })
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false ,
            message : "error updating profile",
            e
        })
    }
    
}