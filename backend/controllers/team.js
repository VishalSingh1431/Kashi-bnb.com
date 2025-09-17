import { prisma } from '../utils/client.js';
import jwt from 'jsonwebtoken';
import { publishUserUpdate } from '../utils/events.js';
import { sendPromotionEmail } from "../utils/mail.js";

// View all users that team members can manage (exclude admins)
export const viewTeamUsers = async (req, res, next) => {
    try {
        console.log('Fetching users for team management...');
        console.log('Team member making request:', req.user);
        
        const users = await prisma.users.findMany({
            where: {
                is_admin: false // Exclude admins from team member management
            },
            select: {
                id: true,
                name: true,
                first_name: true,
                last_name: true,
                email: true,
                mobile: true,
                verified: true,
                is_team_member: true,
                has_hotel: true,
                has_restr: true,
                time: true
            },
            orderBy: {
                time: 'desc'
            }
        });

        // Process users data
        const processedUsers = users.map(user => ({
            ...user,
            mobile: user.mobile || null,
            createdAt: user.time,
            updatedAt: user.time
        }));

        console.log(`Successfully fetched ${processedUsers.length} users for team management`);
        
        res.status(200).json({
            success: true,
            users: processedUsers,
            total: processedUsers.length
        });
    } catch (e) {
        console.error('Error in viewTeamUsers:', e);
        res.status(500).json({
            success: false,
            message: "Error fetching users for team management",
            error: e.message
        });
    }
};

// Promote user to hotel owner (team member or admin)
export const promoteToHotelOwner = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log('Promoting user to hotel owner:', userId);
        
        // Check if user exists
        const userExists = await prisma.users.findUnique({
            where: { id: userId }
        });
        
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is already a hotel owner
        if (userExists.has_hotel) {
            return res.status(400).json({
                success: false,
                message: "User is already a hotel owner"
            });
        }

        // Update user to have hotel access
        const updated = await prisma.users.update({
            where: { id: userId },
            data: { has_hotel: true }
        });

        console.log('User promoted to hotel owner successfully:', updated);

        // Send promotion notification email
        try {
            const userName = updated.first_name && updated.last_name 
                ? `${updated.first_name} ${updated.last_name}` 
                : updated.name || 'Valued User';
            
            await sendPromotionEmail(
                updated.email, 
                'hotel owner', 
                userName
            );
            console.log('Promotion email sent successfully to:', updated.email);
        } catch (emailError) {
            console.error('Error sending promotion email:', emailError);
            // Don't fail the main operation if email fails
        }

        // Refresh token for the affected user
        let token = null;
        try {
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (user) {
                token = jwt.sign(
                    { 
                        id: user.id, 
                        email: user.email, 
                        name: user.name, 
                        first_name: user.first_name, 
                        last_name: user.last_name, 
                        verified: user.verified, 
                        is_admin: user.is_admin, 
                        is_team_member: user.is_team_member,
                        has_hotel: user.has_hotel 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
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
    } catch(e) {
        console.error('Error promoting user to hotel owner:', e);
        
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

// Promote user to restaurant owner (team member or admin)
export const promoteToRestaurantOwner = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log('Promoting user to restaurant owner:', userId);
        
        // Check if user exists
        const userExists = await prisma.users.findUnique({
            where: { id: userId }
        });
        
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is already a restaurant owner
        if (userExists.has_restr) {
            return res.status(400).json({
                success: false,
                message: "User is already a restaurant owner"
            });
        }

        // Update user to have restaurant access
        const updated = await prisma.users.update({
            where: { id: userId },
            data: { has_restr: true }
        });

        console.log('User promoted to restaurant owner successfully:', updated);

        // Send promotion notification email
        try {
            const userName = updated.first_name && updated.last_name 
                ? `${updated.first_name} ${updated.last_name}` 
                : updated.name || 'Valued User';
            
            await sendPromotionEmail(
                updated.email, 
                'restaurant owner', 
                userName
            );
            console.log('Promotion email sent successfully to:', updated.email);
        } catch (emailError) {
            console.error('Error sending promotion email:', emailError);
            // Don't fail the main operation if email fails
        }

        // Refresh token for the affected user
        let token = null;
        try {
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (user) {
                token = jwt.sign(
                    { 
                        id: user.id, 
                        email: user.email, 
                        name: user.name, 
                        first_name: user.first_name, 
                        last_name: user.last_name, 
                        verified: user.verified, 
                        is_admin: user.is_admin, 
                        is_team_member: user.is_team_member,
                        has_hotel: user.has_hotel,
                        has_restr: user.has_restr
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
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
            message: "User promoted to restaurant owner successfully",
            token,
            updatedUser: updated
        });
    } catch(e) {
        console.error('Error promoting user to restaurant owner:', e);
        
        let errorMessage = "Unable to promote user to restaurant owner";
        
        if (e.code === 'P2025') {
            errorMessage = "User not found";
        } else if (e.code === 'P2002') {
            errorMessage = "User already has restaurant access";
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
