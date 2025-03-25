import { prisma } from '../utils/client.js';
import cryptoRandomString from 'crypto-random-string';
import { sendEmail } from '../utils/mail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginControl = async (req,res,nex)=>{
    try{
        const user = await prisma.users.findUnique({
            where:{
                email: req.body.email
            }
        })
        if(!user||(user.verified==false)){
            return res.status(411).json({
                message : "email not verified"
            });
        }
        if(bcrypt.compare(req.body.password,user.password)){
            const token = await jwt.sign(user,process.env.JWT_SEX);
            return res.status(200).json({
                message : "logged in",
                token
            });
        }
        else{
            return res.status(411).json({
                message : "wrong username or password"
            });
        }
    }
    catch(e){
        return res.status(411).json({
            message : "error logingin",
            e
        });
    }
};

export const verification = async (req,res,nex)=>{
    try{
        const token = req.query.token;
        const email = req.query.email;
        if(!token||!email){
            return res.status(411).json({
                message:"no token",
            });
        }
        
        console.log("token ver : ",token);

        const user = await prisma.users.findUnique({
            where : {
                email : email,
            }
        });
        
        console.log(user);

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
                message : "verified",
                user 
            });
        }
        else{
            return res.status(411).json({
                message:"invalid token",
                e
            });
        }

    }
    catch(e){
        return res.status(411).json({
            message:"cant verify",
            e
        });
    }
}

export const signupControl = async (req,res,nex)=>{
    try{
        const user = await prisma.users.findUnique({
            where:{
                email : req.body.email
            }
        });

        if((user)&&(user.verified===true)){
            return res.status(420).json({
                message : "user already exist",
            })
        }

        const token = cryptoRandomString({length:15});
        console.log("token is : ",token);
        req.body.password= await bcrypt.hash(req.body.password,10);
        console.log("salt",req.body.password);
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
                    password : req.body.password,
                    token: token,
                }
            })
        }

        await sendEmail(req.body.email,token);

        return res.status(201).json({
            message:"verify user to finsish",
        })
    }
    catch(e){
        return res.status(411).json({
            message:"unable to gen token",
            e
        });
    }
}

export const checkControl = (req,res,nex)=>{
    return res.json({
        message:"route working"
    });
}

export const makeRequest = async (req,res,nex)=>{
    try{
        await prisma.requests.create({
            data : {
                ...req.body
            }
        })
        return res.status(200).json({
            message : "request created"
        })
    }
    catch(e){
        return res.status(420).json({
            message : "error req created",
            e
        })
    }
}