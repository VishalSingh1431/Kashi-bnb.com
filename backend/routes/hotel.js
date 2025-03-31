import { Router } from "express";
import { getHotels,getUniqueHotel,bookHotel,getMyHotels, updateHotel, addNewHotel, uploadHotImage } from '../controllers/hotel.js';
import { authorisation,hasHotel } from '../middleware/auth.js'
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// router.use('/admin',authorisation,isAdmin,adminRouter);

// unauthorised
router.get('/hotel/:uid',getUniqueHotel);
router.get('/hotels',getHotels);

// user-authorised
router.post('/hotel/:uid/book',authorisation,bookHotel);
// router.get('/signup/verify/',verification);
// router.get('/check',checkControl);
// router.get('/auth-check',authorisation,isAdmin,checkControl);
// router.get('/admin-check',authorisation,isAdmin,checkControl);

// hoteler-authorised
router.get('/my-hotels',authorisation,hasHotel,getMyHotels);
router.post('/create-hotel',authorisation,hasHotel,addNewHotel);
router.post('/hotel/:uid/update-hotel',authorisation,hasHotel,updateHotel);
// router.post('/hotel/:uid/upload-images',authorisation,hasHotel,upload.array("images",5),uploadHotImage);
router.post('/hotel/:uid/upload-images',upload.array("images",5),uploadHotImage);

// admin-authorised

export default router;