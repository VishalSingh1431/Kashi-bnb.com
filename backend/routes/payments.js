import { Router } from "express";
import { authorisation } from "../middleware/auth.js";
import { paymentControl,paymentVerifyControl } from "../controllers/payment.js";

const router = Router();

router.post('/verify',authorisation,paymentVerifyControl);
router.post('/order',authorisation,paymentControl);

export default router;