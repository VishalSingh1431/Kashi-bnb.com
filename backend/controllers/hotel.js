import { prisma } from "../utils/client.js";
import { iUploader } from "../utils/imageUploader.js";

// Fetches all hotels from the database
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

// Fetches a unique hotel by its ID
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

// Book a hotel for the logged-in user.

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


// Get all hotels owned by the logged-in user.

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


// Add a new hotel listing.
export const addNewHotel = async (req,res,nex) =>{
    try{
        // Validate required fields
        const { name, address, rate, details, totalRoom, maxAdults, maxChildren, maxInfants, maxPets, propertyType, guestAccess } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Please enter the property name"
            });
        }
        
        if (!address || address.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Please enter the property address"
            });
        }
        
        if (!rate || rate <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid nightly rate"
            });
        }
        
        if (!details || details.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Please enter the property description"
            });
        }
        
        if (!totalRoom || totalRoom <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter the number of rooms"
            });
        }
        
        // Validate guest limits
        // Set default values if not provided
        const maxAdultsValue = maxAdults || 1;
        const maxChildrenValue = maxChildren || 0;
        const maxInfantsValue = maxInfants || 0;
        const maxPetsValue = maxPets || 0;
        
        if (maxAdultsValue < 1) {
            return res.status(400).json({
                success: false,
                message: "Please set maximum adults (minimum 1)"
            });
        }
        
        const newHotel = await prisma.hotels.create({
            data : {
                ...req.body,
                maxAdults: maxAdultsValue,
                maxChildren: maxChildrenValue,
                maxInfants: maxInfantsValue,
                maxPets: maxPetsValue,
                ownerId : req.user.id,
            }
        })

        // Update user's has_hotel status to true
        await prisma.users.update({
            where: {
                id: req.user.id
            },
            data: {
                has_hotel: true
            }
        });

        return res.status(200).json({
            success : true,
            message : "Hotel created successfully!",
            newHotel
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Error creating hotel listing",
            error: e.message
        });
    }
}


// Update an existing hotel’s details.

export const updateHotel = async (req,res,nex) =>{
    try{
        const id = req.params.uid;
        
        // First check if the hotel exists and user owns it
        const existingHotel = await prisma.hotels.findUnique({
            where: { id: id },
            include: { owner: true }
        });
        
        if (!existingHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }
        
        // Check if user is the owner or admin
        if (existingHotel.ownerId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own hotels"
            });
        }
        
        // Convert string values to integers for numeric fields
        const updateData = { ...req.body };
        const numericFields = ['totalRoom', 'maxInRoom', 'maxAdults', 'maxChildren', 'maxInfants', 'maxPets', 'rate'];
        
        numericFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updateData[field] = parseInt(updateData[field]) || 0;
            }
        });
        
        const newHotel = await prisma.hotels.update({
            where : {
                id : id,
            },
            data : updateData,
            include : {
                owner : {
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
            message : "Hotel updated successfully",
            newHotel
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Error updating hotel",
            error: e.message
        });
    }
}

//Upload images for a hotel.


export const uploadHotImage = async (req,res,nex) => {
    try{
        const id = req.params.uid;
        if(!id){
            return res.status(400).json({
                success : false,
                message : "Hotel ID is required",
            });
        }
        
        // First check if the hotel exists and user owns it
        const existingHotel = await prisma.hotels.findUnique({
            where: { id: id },
            include: { owner: true }
        });
        
        if (!existingHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }
        
        // Check if user is the owner or admin
        if (existingHotel.ownerId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You can only upload images to your own hotels"
            });
        }
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images provided"
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

        return res.status(200).json({
            success : true,
            message: "Images uploaded successfully!", 
            db : insertedImages,
            urls: imageUrlsNames
        });
    }
    catch(e){
        console.error("Error in uploadHotImage:", e);
        return res.status(500).json({
            success : false,
            message : "Error uploading images",
            error: e.message
        });
    }
}