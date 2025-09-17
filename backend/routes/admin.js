import { Router } from "express";
import { checkControl } from "../controllers/user.js";
import { authorisation, isAdmin } from "../middleware/auth.js";
import { makeAdmin, makeHoteler, rejectHoteler, makeRestr, viewRequest, viewAllUsers, deleteUser, promoteToTeamMember, demoteToUser } from "../controllers/admin.js";

const router = Router();

// Simple check route (not protected)
router.get('/check', checkControl);

// Test route to check if admin routes are working
router.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin routes are working"
    });
});

// View all pending requests (admin only)
router.get('/request', authorisation, isAdmin, viewRequest);

// View all users (admin only)
router.get('/users', authorisation, isAdmin, viewAllUsers);

// Promote a user to admin (admin only)
router.post('/makeAdmin', authorisation, isAdmin, makeAdmin);

// Promote a user to hotel owner (admin only)
router.post('/makeHoteler', authorisation, isAdmin, makeHoteler);

// Reject a hotel owner request (admin only)
router.post('/rejectHoteler', authorisation, isAdmin, rejectHoteler);

// Promote a user to restaurant owner (admin only)
router.post('/makeRestr', authorisation, isAdmin, makeRestr);

// Delete user (admin only)
router.delete('/users/:userId', authorisation, isAdmin, deleteUser);

// Promote user to team member (admin only)
router.patch('/users/:userId/promote', authorisation, isAdmin, promoteToTeamMember);

// Demote team member to regular user (admin only)
router.patch('/users/:userId/demote', authorisation, isAdmin, demoteToUser);

export default router;