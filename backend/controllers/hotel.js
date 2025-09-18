import { prisma } from "../utils/client.js";
import { iUploader } from "../utils/imageUploader.js";
import jwt from 'jsonwebtoken';
import { publishUserUpdate } from '../utils/events.js';

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
                staffimages : true,
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

        const { from, to } = req.body;
        
        // Check availability before booking
        const conflicts = await prisma.bookings.findMany({
            where: {
                hotelId: id,
                status: { in: ['confirmed', 'pending'] },
                OR: [
                    {
                        from: { lte: new Date(to) },
                        to: { gte: new Date(from) }
                    }
                ]
            }
        });

        if (conflicts.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Selected dates are not available",
                conflicts: conflicts.map(conflict => ({
                    from: conflict.from,
                    to: conflict.to,
                    status: conflict.status
                }))
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
        // Minimal logging in production
        
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
            maxInRoom: req.body.maxInRoom ? parseInt(req.body.maxInRoom) : 2,
            // New fields for charges and iCal
            petCharge: req.body.petCharge ? parseFloat(req.body.petCharge) : 0.0,
            extraAdultCharge: req.body.extraAdultCharge ? parseFloat(req.body.extraAdultCharge) : 0.0,
            icalLink: req.body.icalLink ? req.body.icalLink.trim() : null,
            // Set initial rating to 5 stars for new hotels
            averageRating: 5.0,
            totalRatings: 1
        };
        
        // Avoid logging full hotel data in production
        
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

        // Issue a fresh token with updated claims (has_hotel now true)
        const updatedUser = await prisma.users.findUnique({ where: { id: req.user.id } });
        const token = jwt.sign(
            {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                verified: updatedUser.verified,
                is_admin: updatedUser.is_admin,
                has_hotel: updatedUser.has_hotel
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );

        await prisma.users.update({ where: { id: updatedUser.id }, data: { token } });
        publishUserUpdate(updatedUser);

        return res.status(200).json({
            success : true,
            message : "Hotel created successfully!",
            newHotel,
            token,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                verified: updatedUser.verified,
                is_admin: updatedUser.is_admin,
                has_hotel: updatedUser.has_hotel
            }
        });
    }
    catch(e){
        console.error("Error creating hotel:", e?.message || e);
        
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
        // Avoid verbose debug logs in production
        
        const id = req.params.uid;
        if(!id){
            console.log("ERROR: No hotel ID provided");
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
            console.log("ERROR: Hotel not found with ID:", id);
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }
        
        console.log("Hotel found:", existingHotel.name);
        console.log("Hotel owner ID:", existingHotel.ownerId);
        console.log("User ID:", req.user.id);
        
        // Check if user is the owner or admin
        if (existingHotel.ownerId !== req.user.id && !req.user.isAdmin) {
            console.log("ERROR: User not authorized to upload to this hotel");
            return res.status(403).json({
                success: false,
                message: "You can only upload images to your own hotels"
            });
        }
        
        // Validate files (only presence; allow any mimetype)
        if (!req.files || req.files.length === 0) {
        // Keep concise logs only
            return res.status(400).json({
                success: false,
                message: "No images provided"
            });
        }
        
        // Log basic file info for debugging, but do not reject by type
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            console.log(`File ${i + 1}:`, {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });
        }
        
        // Check if hotel already has too many images
        const existingImageCount = await prisma.himages.count({
            where: { hotelId: id }
        });
        
        // Keep concise logs only
        
        const maxImages = 50; 
        if (existingImageCount + req.files.length > maxImages) {
            console.log(`ERROR: Too many images. Current: ${existingImageCount}, Adding: ${req.files.length}, Max: ${maxImages}`);
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
                    console.error(`Image ${i + 1} upload attempt ${retryCount} failed:`);
                    
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
        console.error("Error in uploadHotImage:", e?.message || e);
        
        return res.status(500).json({
            success : false,
            message : "Error uploading images. Please try again.",
            error: e.message
        });
    }
}

// Upload staff images for a hotel
export const uploadStaffImages = async (req, res, nex) => {
    try {
        const id = req.params.uid;
        if (!id) {
            console.log("ERROR: No hotel ID provided");
            return res.status(400).json({
                success: false,
                message: "Hotel ID is required",
            });
        }
        
        // First check if the hotel exists and user owns it
        const existingHotel = await prisma.hotels.findUnique({
            where: { id: id },
            include: { owner: true }
        });
        
        if (!existingHotel) {
            console.log("ERROR: Hotel not found with ID:", id);
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }
        
        console.log("Hotel found:", existingHotel.name);
        console.log("Hotel owner ID:", existingHotel.ownerId);
        console.log("User ID:", req.user.id);
        
        // Check if user is the owner or admin
        if (existingHotel.ownerId !== req.user.id && !req.user.is_admin) {
            console.log("ERROR: User not authorized to upload staff images to this hotel");
            return res.status(403).json({
                success: false,
                message: "You can only upload staff images to your own hotels"
            });
        }
        
        // Validate files
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No staff images provided"
            });
        }
        
        // Log basic file info for debugging
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            console.log(`Staff Image ${i + 1}:`, {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });
        }
        
        // Check if hotel already has too many staff images
        const existingStaffImageCount = await prisma.staffimages.count({
            where: { hotelId: id }
        });
        
        const maxStaffImages = 20; // Limit staff images to 20
        if (existingStaffImageCount + req.files.length > maxStaffImages) {
            console.log(`ERROR: Too many staff images. Current: ${existingStaffImageCount}, Adding: ${req.files.length}, Max: ${maxStaffImages}`);
            return res.status(400).json({
                success: false,
                message: `Hotel can have maximum ${maxStaffImages} staff images. You currently have ${existingStaffImageCount} staff images.`
            });
        }
        
        // Upload staff images with retry logic
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
                    await prisma.staffimages.create({
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
                    console.log(`Staff image ${i + 1} uploaded successfully`);
                    
                } catch (uploadError) {
                    retryCount++;
                    console.log(`Staff image ${i + 1} upload attempt ${retryCount} failed:`, uploadError.message);
                    
                    if (retryCount >= maxRetries) {
                        uploadResults.push({
                            success: false,
                            index: i,
                            error: uploadError.message
                        });
                    }
                }
            }
        }
        
        const successfulUploads = uploadResults.filter(result => result.success);
        const failedUploads = uploadResults.filter(result => !result.success);
        
        if (failedUploads.length > 0) {
            console.log(`Some staff images failed to upload: ${failedUploads.length} failed, ${successfulUploads.length} successful`);
        }
        
        return res.status(200).json({
            success: true,
            message: `Staff images uploaded successfully. ${successfulUploads.length} uploaded, ${failedUploads.length} failed.`,
            uploadedImages: uploadResults,
            totalStaffImages: existingStaffImageCount + successfulUploads.length
        });
    }
    catch (e) {
        console.log("ERROR in uploadStaffImages:", e);
        return res.status(500).json({
            success: false,
            message: "Error uploading staff images",
            error: e.message
        });
    }
};

// Delete a staff image
export const deleteStaffImage = async (req, res, nex) => {
    try {
        const { uid, imageId } = req.params;
        
        if (!uid || !imageId) {
            return res.status(400).json({
                success: false,
                message: "Hotel ID and Image ID are required",
            });
        }
        
        // Check if the hotel exists and user owns it
        const existingHotel = await prisma.hotels.findUnique({
            where: { id: uid },
            include: { owner: true }
        });
        
        if (!existingHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }
        
        // Check if user is the owner or admin
        if (existingHotel.ownerId !== req.user.id && !req.user.is_admin) {
            return res.status(403).json({
                success: false,
                message: "You can only delete staff images from your own hotels"
            });
        }
        
        // Check if the staff image exists and belongs to this hotel
        const staffImage = await prisma.staffimages.findFirst({
            where: {
                id: imageId,
                hotelId: uid
            }
        });
        
        if (!staffImage) {
            return res.status(404).json({
                success: false,
                message: "Staff image not found"
            });
        }
        
        // Delete the staff image from database
        await prisma.staffimages.delete({
            where: {
                id: imageId
            }
        });
        
        console.log(`Staff image ${imageId} deleted from hotel ${uid}`);
        
        return res.status(200).json({
            success: true,
            message: "Staff image deleted successfully"
        });
    }
    catch (e) {
        console.log("ERROR in deleteStaffImage:", e);
        return res.status(500).json({
            success: false,
            message: "Error deleting staff image",
            error: e.message
        });
    }
};

// Delete a hotel (hotel owner can delete their own, admin can delete any)
export const deleteHotel = async (req, res, nex) => {
    try {
        console.log('Delete hotel request received');
        console.log('Request params:', req.params);
        console.log('Request user:', req.user);
        
        const hotelId = req.params.uid;
        const userId = req.user.id;
        const isAdmin = req.user.is_admin;

        console.log('Hotel ID:', hotelId);
        console.log('User ID:', userId);
        console.log('Is Admin:', isAdmin);

        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "Hotel ID is required"
            });
        }

        // Find the hotel to check ownership
        const hotel = await prisma.hotels.findUnique({
            where: { id: hotelId },
            include: {
                bookings: true,
                images: true
            }
        });

        console.log('Hotel found:', hotel);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        // Check if user has permission to delete
        if (!isAdmin && hotel.ownerId !== userId) {
            console.log('Permission denied - not admin and not owner');
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this hotel"
            });
        }

        // Check if hotel has active bookings
        const activeBookings = hotel.bookings.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'pending'
        );

        if (activeBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete hotel with active bookings"
            });
        }

        // Delete related records first (due to foreign key constraints)
        await prisma.bookings.deleteMany({
            where: { hotelId: hotelId }
        });

        await prisma.himages.deleteMany({
            where: { hotelId: hotelId }
        });

        // Delete the hotel
        await prisma.hotels.delete({
            where: { id: hotelId }
        });

        console.log('Hotel deleted successfully');

        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully"
        });

    } catch (e) {
        console.log('Error in deleteHotel:', e);
        return res.status(500).json({
            success: false,
            message: "Error deleting hotel",
            e
        });
    }
};

// Submit a rating for a hotel (only users who have booked can rate)
export const submitRating = async (req, res, next) => {
    try {
        const { hotelId, bookingId, rating: ratingValue } = req.body;
        const userId = req.user.id;

        if (!hotelId || !bookingId || !ratingValue) {
            return res.status(400).json({
                success: false,
                message: "Hotel ID, booking ID, and rating are required"
            });
        }

        if (ratingValue < 1 || ratingValue > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if the booking exists and belongs to the user
        const booking = await prisma.bookings.findUnique({
            where: { id: bookingId },
            include: { hotel: true }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only rate hotels you have booked"
            });
        }

        if (booking.hotelId !== hotelId) {
            return res.status(400).json({
                success: false,
                message: "Booking does not match the hotel"
            });
        }

        // Check if user has already rated this booking
        const existingRating = await prisma.rating.findUnique({
            where: { bookingId }
        });

        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: "You have already rated this booking"
            });
        }

        // Create the rating
        const newRating = await prisma.rating.create({
            data: {
                rating: ratingValue,
                bookingId,
                hotelId,
                userId
            }
        });

        // Update hotel's average rating
        await updateHotelRating(hotelId);

        return res.status(200).json({
            success: true,
            message: "Rating submitted successfully",
            rating: newRating
        });
    } catch (e) {
        console.error("Error submitting rating:", e);
        return res.status(500).json({
            success: false,
            message: "Error submitting rating",
            error: e.message
        });
    }
};

// Submit a review for a hotel (only users who have booked can review)
export const submitReview = async (req, res, next) => {
    try {
        const { hotelId, bookingId, content, rating: ratingValue } = req.body;
        const userId = req.user.id;

        if (!hotelId || !bookingId || !content || !ratingValue) {
            return res.status(400).json({
                success: false,
                message: "Hotel ID, booking ID, content, and rating are required"
            });
        }

        if (ratingValue < 1 || ratingValue > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        if (content.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Review content must be at least 10 characters long"
            });
        }

        // Check if the booking exists and belongs to the user
        const booking = await prisma.bookings.findUnique({
            where: { id: bookingId },
            include: { hotel: true }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only review hotels you have booked"
            });
        }

        if (booking.hotelId !== hotelId) {
            return res.status(400).json({
                success: false,
                message: "Booking does not match the hotel"
            });
        }

        // Check if user has already reviewed this booking
        const existingReview = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this booking"
            });
        }

        // Create the review
        const newReview = await prisma.review.create({
            data: {
                content: content.trim(),
                rating: ratingValue,
                bookingId,
                hotelId,
                userId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        first_name: true,
                        last_name: true
                    }
                }
            }
        });

        // Update hotel's average rating
        await updateHotelRating(hotelId);

        return res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            review: newReview
        });
    } catch (e) {
        console.error("Error submitting review:", e);
        return res.status(500).json({
            success: false,
            message: "Error submitting review",
            error: e.message
        });
    }
};

// Get reviews for a hotel
export const getHotelReviews = async (req, res, next) => {
    try {
        const { hotelId } = req.params;

        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "Hotel ID is required"
            });
        }

        const reviews = await prisma.review.findMany({
            where: {
                hotelId,
                isVisible: true
            },
            include: {
                user: {
                    select: {
                        name: true,
                        first_name: true,
                        last_name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            reviews
        });
    } catch (e) {
        console.error("Error getting hotel reviews:", e);
        return res.status(500).json({
            success: false,
            message: "Error getting reviews",
            error: e.message
        });
    }
};

// Get user's bookings that can be rated/reviewed
export const getRateableBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const bookings = await prisma.bookings.findMany({
            where: {
                userId,
                status: "completed" // Only completed bookings can be rated
            },
            include: {
                hotel: {
                    select: {
                        id: true,
                        name: true,
                        images: {
                            take: 1
                        }
                    }
                },
                rating: true,
                review: true
            },
            orderBy: {
                time: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (e) {
        console.error("Error getting rateable bookings:", e);
        return res.status(500).json({
            success: false,
            message: "Error getting bookings",
            error: e.message
        });
    }
};

// Admin function to update review visibility
export const updateReviewVisibility = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { isVisible } = req.body;

        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admins can update review visibility"
            });
        }

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: { isVisible }
        });

        return res.status(200).json({
            success: true,
            message: "Review visibility updated successfully",
            review
        });
    } catch (e) {
        console.error("Error updating review visibility:", e);
        return res.status(500).json({
            success: false,
            message: "Error updating review visibility",
            error: e.message
        });
    }
};

// Helper function to update hotel's average rating
async function updateHotelRating(hotelId) {
    try {
        const ratings = await prisma.rating.findMany({
            where: { hotelId }
        });

        if (ratings.length === 0) {
            // If no ratings, set to initial 5-star rating
            await prisma.hotels.update({
                where: { id: hotelId },
                data: {
                    averageRating: 5.0,
                    totalRatings: 1
                }
            });
            return;
        }

        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / ratings.length;

        await prisma.hotels.update({
            where: { id: hotelId },
            data: {
                averageRating: parseFloat(averageRating.toFixed(1)),
                totalRatings: ratings.length
            }
        });
    } catch (e) {
        console.error("Error updating hotel rating:", e);
    }
}

