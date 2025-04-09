import { prisma } from "../utils/client.js";
import { iUploader } from "../utils/imageUploader.js";

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
                owner : 
                // true,
                {
                    select : {
                        name : true,
                        email : true
                    },
                },
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
                ownerId : req.user.id,
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
                ownerId : req.user.id,
            }
        })

        if(req.files.length===0){
            return res.status(200).json({
                success : true,
                message : "created hotel",
                newHotel
            });
        }
        req.params.uid = newHotel.id;
        return nex();
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
    // console.log("this is body: " ,req.body)
    try{
        const id = req.params.uid;
        const newHotel = await prisma.hotels.update({
            where : {
                id : id,
            },
            data : {
                ...req.body,
            },
            include : {
                owner : 
                // true,
                {
                    select : {
                        name : true,
                        email : true
                    },
                },
                images : true,
                bookings : true,
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

export const uploadHotImage = async (req,res,nex) => {
    try{
        const id = req.params.uid;
        if(!id){
            return res.status(420).json({
                success : false,
                message : "no id",
            });
        }
        
        const uploadPromises = req.files.map(async (file, index) => {
            const response = await iUploader(file,index);
            return response;
        });
        
        const imageUrlsNames = await Promise.all(uploadPromises);
        
        const insertedImages = await prisma.himages.createMany({
            data: imageUrlsNames.map(img => ({
              url: img[0],
              name: img[1],
              hotelId: id
            }))
          });

          console.log("urls" , imageUrlsNames);
          console.log("db" , insertedImages);
        return res.status(200).json({
            success : true,
            message: "Images uploaded successfully!", 
            db : insertedImages,
            urls: imageUrlsNames
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