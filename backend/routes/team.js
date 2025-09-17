import { Router } from "express";
import { authorisation, isTeamMember } from "../middleware/auth.js";
import { viewTeamUsers, promoteToHotelOwner, promoteToRestaurantOwner } from "../controllers/team.js";

const router = Router();

// View all users that team members can manage (team member or admin only)
router.get('/users', authorisation, isTeamMember, viewTeamUsers);

// Promote user to hotel owner (team member or admin only)
router.patch('/users/:userId/promote-hotel', authorisation, isTeamMember, promoteToHotelOwner);

// Promote user to restaurant owner (team member or admin only)
router.patch('/users/:userId/promote-restaurant', authorisation, isTeamMember, promoteToRestaurantOwner);

export default router;
