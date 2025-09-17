import { Router } from "express";
import { getHotels,getUniqueHotel,bookHotel,getMyHotels, updateHotel, addNewHotel, uploadHotImage, deleteHotel, submitRating, submitReview, getHotelReviews, getRateableBookings, updateReviewVisibility } from '../controllers/hotel.js';
import { authorisation,hasHotel } from '../middleware/auth.js'
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});
const router = Router();

// router.use('/admin',authorisation,isAdmin,adminRouter);

// unauthorised
router.get('/hotels',getHotels);

// user-authorised
router.post('/hotel/:uid/book',authorisation,bookHotel);
router.post('/hotel/rating',authorisation,submitRating);
router.post('/hotel/review',authorisation,submitReview);
router.get('/hotel/bookings/rateable',authorisation,getRateableBookings);
// router.get('/signup/verify/',verification);
// router.get('/check',checkControl);
// router.get('/auth-check',authorisation,isAdmin,checkControl);
// router.get('/admin-check',authorisation,isAdmin,checkControl);

// unauthorised routes (moved before authorized routes to avoid conflicts)
router.get('/hotel/:uid',getUniqueHotel);
router.get('/hotel/:uid/reviews',getHotelReviews);

// hoteler-authorised
router.get('/my-hotels',authorisation,hasHotel,getMyHotels);
router.post('/create-hotel',authorisation,addNewHotel);
router.post('/hotel/:uid/update-hotel',authorisation,updateHotel);
router.post('/hotel/:uid/upload-images',authorisation,upload.array("images",100),uploadHotImage);
router.delete('/hotel/:uid',authorisation,deleteHotel);
// router.post('/hotel/:uid/upload-images',upload.array("images",5),uploadHotImage);

// admin-authorised
router.patch('/review/:reviewId/visibility',authorisation,updateReviewVisibility);

export default router;