import express from 'express';
import { 
  checkAvailability, 
  getHotelBookings, 
  blockDates, 
  updateBookingStatus, 
  getAvailabilityCalendar 
} from '../controllers/calendar.js';
import { authorisation } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/check-availability', checkAvailability);
router.get('/availability/:hotelId', getAvailabilityCalendar);

// Protected routes (require authentication)
router.get('/bookings/:hotelId', authorisation, getHotelBookings);
router.post('/block-dates', authorisation, blockDates);
router.patch('/booking/:bookingId/status', authorisation, updateBookingStatus);

export default router;
