import { prisma } from '../utils/client.js';

export const makeAdmin = async (req,res,nex)=>{
    try{
        await prisma.users.update({
            where : {
                email : req.body.email
            },
            data : {
                is_admin : true,
            }
        })
        await prisma.requests.delete({
            where : {
                email : req.body.email,
                type : "admin"
            }
        });
        return res.status(200).json({
            success : true,
            message : "promoted to admin"
        })
        
    }
    catch(e){
        console.log(e);
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
            data : {
                has_hotel : true,
            }
        });

        await prisma.requests.delete({
            where : {
                email : req.body.email,
                type : "hotelowner"
            }
        });

        return res.status(200).json({
            success : true,
            message : "promoted to hotel wala bhosdi wala"
        })
    }
    catch(e){
        console.log(e);
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
            data : {
                has_restr : true,
            }
        })

        await prisma.requests.delete({
            where : {
                email : req.body.email,
                type : "restaurantowner"
            }
        });

        return res.status(200).json({
            success : true,
            message : "promoted to restr  wala"
        })
    }
    catch(e){
        console.log(e);
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
        console.log(e);
        res.status(420).json({
            success : false,
            message : "error getting req",
            e
        });
    }
}

// console.log(e);