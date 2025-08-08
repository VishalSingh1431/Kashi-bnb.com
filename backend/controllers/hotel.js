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
        console.log("Received request body:", req.body);
        console.log("User from request:", req.user);
        
        // Basic validation - only check for required fields
        const validationErrors = [];
        
        // Validate required fields
        const { name, address, rate, details, totalRoom, maxAdults, maxChildren, maxInfants, maxPets, propertyType, guestAccess } = req.body;
        
        if (!name || name.trim() === '') {
            validationErrors.push("Property name is required");
        }
        
        if (!address || address.trim() === '') {
            validationErrors.push("Property address is required");
        }
        
        if (!rate || isNaN(rate) || parseFloat(rate) <= 0) {
            validationErrors.push("Please enter a valid nightly rate (greater than 0)");
        }
        
        if (!details || details.trim() === '') {
            validationErrors.push("Property description is required");
        }
        
        if (!totalRoom || isNaN(totalRoom) || parseInt(totalRoom) <= 0) {
            validationErrors.push("Please enter a valid number of rooms (greater than 0)");
        }
        
        // Set default values for guest limits if not provided
        const maxAdultsValue = maxAdults ? parseInt(maxAdults) : 1;
        const maxChildrenValue = maxChildren ? parseInt(maxChildren) : 0;
        const maxInfantsValue = maxInfants ? parseInt(maxInfants) : 0;
        const maxPetsValue = maxPets ? parseInt(maxPets) : 0;
        
        // Only check for negative values, no upper limits
        if (maxAdultsValue < 1) {
            validationErrors.push("Maximum adults must be at least 1");
        }
        
        if (maxChildrenValue < 0) {
            validationErrors.push("Maximum children cannot be negative");
        }
        
        if (maxInfantsValue < 0) {
            validationErrors.push("Maximum infants cannot be negative");
        }
        
        if (maxPetsValue < 0) {
            validationErrors.push("Maximum pets cannot be negative");
        }
        
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors.join("; "),
                errors: validationErrors
            });
        }
        
        // Prepare data for database with proper sanitization
        const hotelData = {
            name: name.trim(),
            address: address.trim(),
            rate: parseFloat(rate),
            details: details.trim(),
            totalRoom: parseInt(totalRoom),
            maxAdults: maxAdultsValue,
            maxChildren: maxChildrenValue,
            maxInfants: maxInfantsValue,
            maxPets: maxPetsValue,
            propertyType: propertyType || 'House',
            guestAccess: guestAccess || 'Entire place',
            ownerId: req.user.id,
            // Add other fields with defaults and validation
            gmap: req.body.gmap ? req.body.gmap.trim() : '',
            videoUrl: req.body.videoUrl ? req.body.videoUrl.trim() : null,
            wifi: Boolean(req.body.wifi),
            tv: Boolean(req.body.tv),
            kitchen: Boolean(req.body.kitchen),
            washingmachine: Boolean(req.body.washingmachine),
            parking: Boolean(req.body.parking),
            ac: Boolean(req.body.ac),
            pool: Boolean(req.body.pool),
            fireextinguisher: Boolean(req.body.fireextinguisher),
            firstaid: Boolean(req.body.firstaid),
            geyser: Boolean(req.body.geyser),
            microwave: Boolean(req.body.microwave),
            waterFilter: Boolean(req.body.waterFilter),
            maxInRoom: req.body.maxInRoom ? parseInt(req.body.maxInRoom) : 2
        };
        
        console.log("Hotel data to be created:", hotelData);
        
        // Create hotel with transaction for data consistency
        const newHotel = await prisma.$transaction(async (tx) => {
            const hotel = await tx.hotels.create({
                data: hotelData
            });

            // Update user's has_hotel status to true
            await tx.users.update({
                where: {
                    id: req.user.id
                },
                data: {
                    has_hotel: true
                }
            });
            
            return hotel;
        });

        return res.status(200).json({
            success : true,
            message : "Hotel created successfully!",
            newHotel
        });
    }
    catch(e){
        console.error("Error creating hotel:", e);
        console.error("Error details:", {
            message: e.message,
            code: e.code,
            meta: e.meta,
            stack: e.stack
        });
        
        // Handle specific database errors
        if (e.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "A hotel with this name already exists. Please choose a different name."
            });
        }
        
        if (e.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: "Invalid user reference. Please log in again."
            });
        }
        
        return res.status(500).json({
            success : false,
            message : "Error creating hotel listing. Please try again.",
            error: process.env.NODE_ENV === 'development' ? e.message : 'Internal server error'
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
        
        // Validate file types and sizes
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: `File ${i + 1} has an unsupported format. Please use JPEG, PNG, or WebP images.`
                });
            }
            
            // Removed file size validation - no limits
        }
        
        // Check if hotel already has too many images
        const existingImageCount = await prisma.himages.count({
            where: { hotelId: id }
        });
        
        const maxImages = 10;
        if (existingImageCount + req.files.length > maxImages) {
            return res.status(400).json({
                success: false,
                message: `Hotel can have maximum ${maxImages} images. You currently have ${existingImageCount} images.`
            });
        }
        
        // Upload images with retry logic
        const uploadResults = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            let uploadSuccess = false;
            let retryCount = 0;
            const maxRetries = 3;
            
            while (!uploadSuccess && retryCount < maxRetries) {
                try {
                    const [imageUrl, imageName] = await iUploader(file, i);
                    
                    // Save to database
                    await prisma.himages.create({
                        data: {
                            url: imageUrl,
                            name: imageName,
                            hotelId: id
                        }
                    });
                    
                    uploadResults.push({
                        success: true,
                        index: i,
                        url: imageUrl,
                        name: imageName
                    });
                    uploadSuccess = true;
                    
                } catch (uploadError) {
                    retryCount++;
                    console.error(`Image ${i + 1} upload attempt ${retryCount} failed:`, uploadError);
                    
                    if (retryCount >= maxRetries) {
                        uploadResults.push({
                            success: false,
                            index: i,
                            error: uploadError.message || 'Upload failed'
                        });
                    } else {
                        // Wait before retrying
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    }
                }
            }
        }
        
        // Check upload results
        const successfulUploads = uploadResults.filter(result => result.success);
        const failedUploads = uploadResults.filter(result => !result.success);
        
        if (failedUploads.length > 0) {
            const failedIndices = failedUploads.map(f => f.index + 1).join(', ');
            return res.status(207).json({
                success: true,
                message: `Some images uploaded successfully. Failed images: ${failedIndices}`,
                successfulUploads: successfulUploads.length,
                failedUploads: failedUploads.length,
                results: uploadResults
            });
        }

        return res.status(200).json({
            success : true,
            message: "Images uploaded successfully!", 
            uploadedCount: successfulUploads.length,
            results: uploadResults
        });
    }
    catch(e){
        console.error("Error in uploadHotImage:", e);
        
        return res.status(500).json({
            success : false,
            message : "Error uploading images. Please try again.",
            error: process.env.NODE_ENV === 'development' ? e.message : 'Internal server error'
        });
    }
}