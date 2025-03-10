import {Router} from "express";
import { loginControl, signupControl, checkControl } from "../controllers/user.js";
import { authorisation } from "../middleware/auth.js";

const router = Router();

router.get('/login',loginControl);
router.get('/signup',signupControl);
router.get('/id/:uid',authorisation,signupControl);
router.get('/check',checkControl);

export default router;