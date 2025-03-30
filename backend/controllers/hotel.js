import { prisma } from "../utils/client.js";

export const getHotels = async (req,res,nex)=>{
    try{
        const hotels = await prisma.hotels.findMany({
            include: {
                owner: {
                    select : {
                        name : true,
                        email : true,
                    }
                },
                images: {
                    take: 1,
                }
            }
        });
        return res.status(200).json({
            success : true, 
            hotels 
        });
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "error getting hotels",e
        });
    }
};

export const getUniqueHotel = async (req,res,nex)=>{
    try{
        const id = req.params.uid;
        if(!id){
            return res.status(420).json({
                success : false,
                message : "no id",
            });
        }
        const hotel = await prisma.hotels.findUnique({
            where : {
                id
            },
            include : {
                owner : true,
                // {
                //     select : {
                //         name : true,
                //         email : true
                //     },
                // },
                images : true,
                bookings : true,
            }
        });
        return res.status(200).json({
            success : true,
            ...hotel
        })
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "error getting hotels",e
        });
    }
};


export const bookHotel = async (req,res,nex) => {
    try{
        const id = req.params.uid;
        if(!id){
            return res.status(420).json({
                success : false,
                message : "no id",
            });
        }
        
        const booking = await prisma.bookings.create({
            data : {
                ...req.body,
                hotelId : id,
                userId : req.user.id,
            }
        })
        return res.status(200).json({
            success : true,
            message : "booked hotel",
            booking
        });
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "error booking hotel",e
        });
    }
};


export const getMyHotels = async (req,res,nex) =>{
    try{
        const hotels = await prisma.hotels.findMany({
            where : {
                email : req.user.email,
            },
            include : {
                bookings : true,
            }
        })
        return res.status(200).json({
            success : true,
            message : "your hotels",
            hotels
        });
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "error getting your hotels",e
        });
    }
}


export const addNewHotel = async (req,res,nex) =>{
    try{
        const newHotel = await prisma.hotels.create({
            data : {
                ...req.body,
                userId : req.user.id,
            }
        })
        return res.status(200).json({
            success : true,
            message : "created hotel",
            newHotel
        });
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "error getting your hotels",e
        });
    }
}

export const updateHotel = async (req,res,nex) =>{
    try{
        const id = req.params.uid;
        console.log(req.body)
        const newHotel = await prisma.hotels.update({
            where : {
                id : id,
            },
            update : {
                ...req.body,
            }
        })
        return res.status(200).json({
            success : true,
            message : "updated hotel",
            newHotel
        });
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false,
            message : "error getting your hotels",e
        });
    }
}
