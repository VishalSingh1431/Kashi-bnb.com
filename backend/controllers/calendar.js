import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Check availability for a specific date range
export const checkAvailability = async (req, res) => {
  try {
    const { hotelId, from, to } = req.body;

    if (!hotelId || !from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID, from date, and to date are required'
      });
    }

    // Check for existing bookings that overlap with the requested dates
    const conflicts = await prisma.bookings.findMany({
      where: {
        hotelId,
        status: { in: ['confirmed', 'pending'] },
        OR: [
          {
            // Booking starts before requested end and ends after requested start
            from: { lte: new Date(to) },
            to: { gte: new Date(from) }
          }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    const isAvailable = conflicts.length === 0;

    return res.status(200).json({
      success: true,
      available: isAvailable,
      conflicts: conflicts.map(conflict => ({
        id: conflict.id,
        from: conflict.from,
        to: conflict.to,
        status: conflict.status,
        guestName: conflict.user.name,
        guestEmail: conflict.user.email
      }))
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};

// Get all bookings for a hotel with calendar view
export const getHotelBookings = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { month, year } = req.query;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    // Calculate date range for the month
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);

    const bookings = await prisma.bookings.findMany({
      where: {
        hotelId,
        OR: [
          {
            from: { gte: startDate, lte: endDate }
          },
          {
            to: { gte: startDate, lte: endDate }
          },
          {
            from: { lte: startDate },
            to: { gte: endDate }
          }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        payment: true
      },
      orderBy: {
        from: 'asc'
      }
    });

    // Group bookings by date for calendar view
    const calendarData = {};
    bookings.forEach(booking => {
      const start = new Date(booking.from);
      const end = new Date(booking.to);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = [];
        }
        calendarData[dateKey].push({
          id: booking.id,
          status: booking.status,
          guestName: booking.user.name,
          guestEmail: booking.user.email,
          guestPhone: booking.user.phone,
          from: booking.from,
          to: booking.to,
          message: booking.message,
          paymentStatus: booking.payment ? 'paid' : 'pending'
        });
      }
    });

    return res.status(200).json({
      success: true,
      bookings,
      calendarData,
      month: month || new Date().getMonth(),
      year: year || new Date().getFullYear()
    });
  } catch (error) {
    console.error('Error getting hotel bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting hotel bookings',
      error: error.message
    });
  }
};

// Block dates for a hotel (owner only)
export const blockDates = async (req, res) => {
  try {
    const { hotelId, from, to, reason } = req.body;
    const ownerId = req.user.id;

    if (!hotelId || !from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID, from date, and to date are required'
      });
    }

    // Verify the user owns this hotel
    const hotel = await prisma.hotels.findFirst({
      where: {
        id: hotelId,
        ownerId
      }
    });

    if (!hotel) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to block dates for this hotel'
      });
    }

    // Check for existing bookings in the date range
    const existingBookings = await prisma.bookings.findMany({
      where: {
        hotelId,
        status: { in: ['confirmed', 'pending'] },
        OR: [
          {
            from: { lte: new Date(to) },
            to: { gte: new Date(from) }
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot block dates with existing bookings',
        existingBookings: existingBookings.map(booking => ({
          id: booking.id,
          from: booking.from,
          to: booking.to,
          status: booking.status
        }))
      });
    }

    // Create blocked dates entry (you might want to create a separate blocked_dates table)
    // For now, we'll create a special booking with status 'blocked'
    const blockedBooking = await prisma.bookings.create({
      data: {
        hotelId,
        userId: ownerId,
        from: new Date(from),
        to: new Date(to),
        email: req.user.email,
        message: reason || 'Dates blocked by owner',
        status: 'blocked'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Dates blocked successfully',
      blockedBooking
    });
  } catch (error) {
    console.error('Error blocking dates:', error);
    return res.status(500).json({
      success: false,
      message: 'Error blocking dates',
      error: error.message
    });
  }
};

// Update booking status (owner only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, rejectionReason } = req.body;
    const ownerId = req.user.id;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and status are required'
      });
    }

    // Get the booking with hotel info
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify the user owns this hotel
    if (booking.hotel.ownerId !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this booking'
      });
    }

    // Update booking status
    const updatedBooking = await prisma.bookings.update({
      where: { id: bookingId },
      data: {
        status,
        ...(status === 'rejected' && rejectionReason && { message: rejectionReason })
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// Get availability calendar for a specific month
export const getAvailabilityCalendar = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { month, year } = req.query;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    const targetMonth = month || new Date().getMonth();
    const targetYear = year || new Date().getFullYear();
    
    // Get start and end of month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    // Get all bookings for the month
    const bookings = await prisma.bookings.findMany({
      where: {
        hotelId,
        OR: [
          {
            from: { gte: startDate, lte: endDate }
          },
          {
            to: { gte: startDate, lte: endDate }
          },
          {
            from: { lte: startDate },
            to: { gte: endDate }
          }
        ]
      },
      select: {
        id: true,
        from: true,
        to: true,
        status: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Create calendar grid
    const calendar = [];
    const daysInMonth = endDate.getDate();
    const firstDayOfMonth = startDate.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push({ date: null, bookings: [], available: false });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(targetYear, targetMonth, day);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(booking => {
        const bookingStart = new Date(booking.from);
        const bookingEnd = new Date(booking.to);
        return currentDate >= bookingStart && currentDate <= bookingEnd;
      });

      calendar.push({
        date: day,
        fullDate: currentDate,
        dateKey,
        bookings: dayBookings,
        available: dayBookings.length === 0,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
    }

    return res.status(200).json({
      success: true,
      calendar,
      month: targetMonth,
      year: targetYear,
      monthName: startDate.toLocaleString('default', { month: 'long' })
    });
  } catch (error) {
    console.error('Error getting availability calendar:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting availability calendar',
      error: error.message
    });
  }
};
