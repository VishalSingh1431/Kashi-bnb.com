import {Router} from "express";
import { loginControl, signupControl, checkControl,updateProfile, verification ,sendProfile, makeRequest } from "../controllers/user.js";
import { authorisation, hasHotel, isAdmin } from "../middleware/auth.js";
import adminRouter from './admin.js';

const router = Router();

// admin
router.use('/admin',authorisation,isAdmin,adminRouter);

// user
// unauth
router.post('/login',loginControl);
router.post('/signup',signupControl);
router.get('/signup/verify/',verification);
router.get('/check',checkControl);

// auth
router.put('/profile',authorisation,updateProfile);
router.post('/upgrade_request',authorisation,makeRequest);
// router.post('/upgrade_admin_request',authorisation,makeAdminRequest);
router.get('/profile/id/:uid',authorisation,sendProfile);
router.get('/auth-check',authorisation,checkControl);
router.get('/admin-check',authorisation,isAdmin,checkControl);
router.get('/hotel-check',authorisation,hasHotel,checkControl);

export default router;