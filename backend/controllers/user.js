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
                success : false ,
                message : "email not verified"
            });
        }
        if(await bcrypt.compare(req.body.password,user.password)){
            const token = await jwt.sign(user,process.env.JWT_SEX);
            user.password=null;
            user.token=null;
            return res.status(200).json({
                success : true,
                message : "logged in",
                token : `Bearer ${token}`,
                user
            });
        }
        else{
            return res.status(411).json({
                success : false ,
                message : "wrong username or password"
            });
        }
    }
    catch(e){
        return res.status(411).json({
            success : false ,
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
                success : false ,
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
        const user = await prisma.users.findUnique({
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
            success : true,
            message:"verify user to finsish",
        })
    }
    catch(e){
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

export const makeRequest = async (req,res,nex)=>{
    try{
        await prisma.requests.create({
            data : {
                ...req.body
            }
        })
        return res.status(200).json({
            success : true,
            message : "request created"
        })
    }
    catch(e){
        return res.status(420).json({
            success : false ,
            message : "error req created",
            e
        })
    }
}


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
                id : req.user.id
            },
            include : {
                bookings : true,
                hotels_name : true,
                restr_name : true,
                blogs_name : true
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
        return res.status(420).json({
            success : false ,
            message : "error getting profile",
            e
        })
    }
    
}