import { Router } from "express";
import { checkControl } from "../controllers/user.js";
import { authorisation, isAdmin } from "../middleware/auth.js";
import { makeAdmin, makeHoteler, makeRestr ,viewRequest } from "../controllers/admin.js";

const router = Router();

// Simple check route (not protected)
router.get('/check', checkControl);

// View all pending requests (admin only)
router.get('/request', authorisation, isAdmin, viewRequest);

// Promote a user to admin (admin only)
router.post('/makeAdmin', authorisation, isAdmin, makeAdmin);

// Promote a user to hotel owner (admin only)
router.post('/makeHoteler', authorisation, isAdmin, makeHoteler);

// Promote a user to restaurant owner (admin only)
router.post('/makeRestr', authorisation, isAdmin, makeRestr);

export default router;