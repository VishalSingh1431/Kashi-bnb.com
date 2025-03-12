import { PrismaClient } from '@prisma/client'
import cryptoRandomString from 'crypto-random-string';

const prisma = new PrismaClient();

export const loginControl = async (req,res,nex)=>{
}

export const verification = async (req,res,nex)=>{
    try{
        const token = req.params.token;
        if(!token){
            return res.status(411).json({
                message:"no token",
            });
        }
        
        const user = await prisma.users.update({
            where : {
                token : token,
            },
            data : {
                token : null,
                is_verified : true,
            }
        });


    }
    catch(e){
        return res.status(411).json({
            message:"no token",
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
        if(!user)
        user = await prisma.users.create({
            data: {
                ...req.body
            }
        });

        const token = cryptoRandomString({length:15});
        await prisma.users.update({
            where:{
                email: req.body.email
            },
            data:{
                token: token,
            }
        })

        
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