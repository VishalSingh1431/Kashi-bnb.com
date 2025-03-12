import {Router} from "express";
import { loginControl, signupControl, checkControl, verification } from "../controllers/user.js";
import { authorisation } from "../middleware/auth.js";

const router = Router();

router.post('/login',loginControl);
router.post('/signup',signupControl);
router.get('/signup/verify/:token',verification);
router.get('/id/:uid',authorisation,signupControl);
router.get('/check',checkControl);

export default router;