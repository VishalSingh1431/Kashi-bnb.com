import { Router } from "express";
import { checkControl } from "../controllers/user.js";
import { authorisation, isAdmin } from "../middleware/auth.js";
import { makeAdmin, makeHoteler, makeRestr ,viewRequest } from "../controllers/admin.js";

const router = Router();

router.get('/check',checkControl);
router.get('/request',viewRequest);
router.post('/makeAdmin',authorisation,isAdmin,makeAdmin);
router.post('/makeHoteler',authorisation,isAdmin,makeHoteler);
router.post('/makeRestr',authorisation,isAdmin,makeRestr);

export default router;