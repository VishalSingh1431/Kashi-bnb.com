import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const loginControl = async (req,res,nex)=>{
}

export const verification = async (req,res,nex)=>{

}

export const signupControl = async (req,res,nex)=>{
    const user = await prisma.users.create({
        data: {
            ...req.body
        }
    })
    
}

export const checkControl = (req,res,nex)=>{
    return res.json({
        message:"route working"
    });
}