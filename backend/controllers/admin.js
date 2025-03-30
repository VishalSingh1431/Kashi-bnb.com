import { prisma } from '../utils/client.js';

export const makeAdmin = async (req,res,nex)=>{
    try{
        await prisma.users.update({
            where : {
                email : req.body.email
            },
            update : {
                is_admin : true,
            }
        })
        return res.status(200).json({
            success : true,
            message : "promoted to admin"
        })
    }
    catch(e){
        return res.status(420).json({
            success : false,
            message : "unable to promote",
            e
        })
    }
};

export const makeHoteler = async (req,res,nex)=>{
    try{
        await prisma.users.update({
            where : {
                email : req.body.email
            },
            update : {
                has_hotel : true,
            }
        })
        return res.status(200).json({
            success : true,
            message : "promoted to hotel wala bhosdi wala"
        })
    }
    catch(e){
        return res.status(420).json({
            success : false,
            message : "unable to promote",
            e
        })
    }
};

export const makeRestr = async (req,res,nex)=>{
    try{
        await prisma.users.update({
            where : {
                email : req.body.email
            },
            update : {
                has_restr : true,
            }
        })
        return res.status(200).json({
            success : true,
            message : "promoted to restr wala bhosdi wala"
        })
    }
    catch(e){
        return res.status(420).json({
            success : false,
            message : "unable to promote",
            e
        })
    }
};

export const viewRequest = async (req,res,nex)=>{
    try{
        const request = await prisma.requests.findMany();
        res.status(200).json({
            success : true,
            request
        });
    }
    catch(e){
        res.status(420).json({
            success : false,
            message : "error getting req",
            e
        });
    }
}
