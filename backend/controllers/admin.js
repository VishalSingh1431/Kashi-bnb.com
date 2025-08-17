import { prisma } from '../utils/client.js';
import jwt from 'jsonwebtoken';
import { publishUserUpdate } from '../utils/events.js';
import { sendPromotionEmail } from "../utils/mail.js";


// make admin
export const makeAdmin = async (req,res,nex)=>{
    try{
        // Get user details before updating
        const userExists = await prisma.users.findUnique({
            where: { email: req.body.email }
        });
        
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        //  is_admin : true
        const updated = await prisma.users.update({
            where : {
                email : req.body.email
            },
            data : {
                is_admin : true,
            }
        });

        // Send promotion notification email
        try {
            const userName = updated.first_name && updated.last_name 
                ? `${updated.first_name} ${updated.last_name}` 
                : updated.name || 'Valued User';
            
            await sendPromotionEmail(
                req.body.email, 
                'admin', 
                userName
            );
            console.log('Admin promotion email sent successfully to:', req.body.email);
        } catch (emailError) {
            console.error('Error sending admin promotion email:', emailError);
            // Don't fail the main operation if email fails
        }

        // delete the request from requests table
        // where email and type is admin
        await prisma.requests.delete({
            where: {
                email: req.body.email,
                type: "admin"
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
        console.log('Making user hotel owner:', req.body.email);
        
        // First check if user exists
        const userExists = await prisma.users.findUnique({
            where: { email: req.body.email }
        });
        
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update user to have hotel access
        const updated = await prisma.users.update({
            where: { email: req.body.email },
            data: { has_hotel: true }
        });

        console.log('User updated successfully:', updated);

        // Send promotion notification email
        try {
            const userName = updated.first_name && updated.last_name 
                ? `${updated.first_name} ${updated.last_name}` 
                : updated.name || 'Valued User';
            
            await sendPromotionEmail(
                req.body.email, 
                'hotel owner', 
                userName
            );
            console.log('Promotion email sent successfully to:', req.body.email);
        } catch (emailError) {
            console.error('Error sending promotion email:', emailError);
            // Don't fail the main operation if email fails
        }

        // Update request status to approved instead of deleting
        await prisma.requests.updateMany({
            where: {
                email: req.body.email,
                type: "hotelowner"
            },
            data: {
                status: "approved",
                approvedAt: new Date(),
                approvedBy: req.user.id
            }
        });

        // refresh token for the affected user if the request user is the same
        let token = null;
        try {
            const user = await prisma.users.findUnique({ where: { email: req.body.email } });
            if (user) {
                token = jwt.sign(
                    { id: user.id, email: user.email, name: user.name, first_name: user.first_name, last_name: user.last_name, verified: user.verified, is_admin: user.is_admin, has_hotel: user.has_hotel },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );
                await prisma.users.update({ where: { id: user.id }, data: { token } });
                publishUserUpdate(user);
            }
        } catch(e) { 
            console.error('Token refresh error:', e);
            // Don't fail the main operation if token refresh fails
        }

        return res.status(200).json({
            success: true,
            message: "User promoted to hotel owner successfully",
            token,
            updatedUser: updated
        });
    }
    catch(e){
        console.error('Error making user hotel owner:', e);
        
        // Provide more specific error messages
        let errorMessage = "Unable to promote user to hotel owner";
        
        if (e.code === 'P2025') {
            errorMessage = "User not found";
        } else if (e.code === 'P2002') {
            errorMessage = "User already has hotel access";
        } else if (e.message) {
            errorMessage = e.message;
        }
        
        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: e.message
        });
    }
};

// Reject hotel owner request
export const rejectHoteler = async (req, res, nex) => {
    try {
        console.log('Rejecting hotel owner request for:', req.body.email);
        
        // Check if user exists
        const userExists = await prisma.users.findUnique({
            where: { email: req.body.email }
        });
        
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update request status to rejected
        await prisma.requests.updateMany({
            where: {
                email: req.body.email,
                type: "hotelowner"
            },
            data: {
                status: "rejected",
                rejectedAt: new Date(),
                rejectedBy: req.user.id,
                rejectionReason: req.body.reason || "Request rejected by admin"
            }
        });

        console.log('Request rejected successfully');

        return res.status(200).json({
            success: true,
            message: "Hotel owner request rejected successfully"
        });
    }
    catch(e) {
        console.error('Error rejecting hotel owner request:', e);
        
        let errorMessage = "Unable to reject hotel owner request";
        
        if (e.code === 'P2025') {
            errorMessage = "Request not found";
        } else if (e.message) {
            errorMessage = e.message;
        }
        
        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: e.message
        });
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
        const requests = await prisma.requests.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        // Group requests by status
        const groupedRequests = {
            pending: requests.filter(r => !r.status || r.status === 'pending'),
            approved: requests.filter(r => r.status === 'approved'),
            rejected: requests.filter(r => r.status === 'rejected'),
            declined: requests.filter(r => r.status === 'declined')
        };
        
        res.status(200).json({
            success: true,
            requests: groupedRequests,
            total: requests.length
        });
    }
    catch(e){
        console.error('Error getting requests:', e);
        res.status(500).json({
            success: false,
            message: "Error getting requests",
            error: e.message
        });
    }
};

// View all users (admin only)
export const viewAllUsers = async (req, res, next) => {
    try {
        console.log('Fetching all users...');
        console.log('User making request:', req.user);
        
        // Test database connection first
        try {
            await prisma.$connect();
            console.log('Database connected successfully');
        } catch (dbError) {
            console.error('Database connection failed:', dbError);
            return res.status(500).json({
                success: false,
                message: "Database connection failed",
                error: dbError.message
            });
        }
        
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                first_name: true,
                last_name: true,
                email: true,
                mobile: true,
                verified: true,
                is_admin: true,
                has_hotel: true,
                has_restr: true,
                time: true
            },
            orderBy: {
                time: 'desc'
            }
        });

        // Ensure mobile field is handled properly and format dates
        const processedUsers = users.map(user => ({
            ...user,
            mobile: user.mobile || null,
            createdAt: user.time,
            updatedAt: user.time
        }));

        console.log(`Successfully fetched ${processedUsers.length} users`);
        
        res.status(200).json({
            success: true,
            users: processedUsers,
            total: processedUsers.length
        });
    } catch (e) {
        console.error('Error in viewAllUsers:', e);
        console.error('Error stack:', e.stack);
        console.error('Error name:', e.name);
        console.error('Error message:', e.message);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: e.message,
            stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
        });
    }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting themselves
        if (user.is_admin && user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own admin account"
            });
        }

        // Delete user's hotels if they have any
        if (user.has_hotel) {
          try {
            await prisma.hotels.deleteMany({
              where: { ownerId: userId }
            });
            console.log(`Deleted ${user.name}'s hotels`);
          } catch (hotelError) {
            console.error('Error deleting user hotels:', hotelError);
          }
        }

        // Delete user's OTPs
        if (user.mobile) {
          try {
            await prisma.oTP.deleteMany({
              where: { mobile: user.mobile } // Changed from 'phone' to 'mobile'
            });
            console.log(`Deleted ${user.name}'s OTPs`);
          } catch (otpError) {
            console.error('Error deleting user OTPs:', otpError);
          }
        }

        // Delete user's requests
        try {
          await prisma.requests.deleteMany({
            where: { email: user.email }
          });
          console.log(`Deleted ${user.name}'s requests`);
        } catch (requestError) {
          console.error('Error deleting user requests:', requestError);
        }

        // Finally delete the user
        await prisma.users.delete({
          where: { id: userId }
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: e.message
        });
    }
};