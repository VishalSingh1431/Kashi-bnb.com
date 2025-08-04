import { prisma } from '../utils/client.js';


// make admin
export const makeAdmin = async (req,res,nex)=>{
    try{
        //  is_admin : true
        await prisma.users.update({
            where : {
                email : req.body.email
            },
            data : {
                is_admin : true,
            }
        })
        // delete the request from requests table
        // where email and type is admin
        await prisma.requests.delete({
            where : {
                email : req.body.email,
                type : "admin"
            }
        });
        // return success response
        return res.status(200).json({
            success : true,
            message : "promoted to admin"
        })
        
    }
    // catch any error
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "unable to promote",
            e
        })
    }
};

// to make hotel owner
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
            message : "promoted to hotel wala "
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

// to make restaurant owner

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


// View all pending requests for role changes.

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