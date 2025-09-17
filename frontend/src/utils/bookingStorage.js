// Booking data persistence utility
// Stores and retrieves booking details in localStorage

const BOOKING_DATA_KEY = 'kashiBnb_booking_data';

// Save booking data for a specific hotel
export const saveBookingData = (hotelId, bookingData) => {
  try {
    const existingData = getStoredBookingData();
    const updatedData = {
      ...existingData,
      [hotelId]: {
        ...bookingData,
        timestamp: Date.now() // Track when data was saved
      }
    };
    localStorage.setItem(BOOKING_DATA_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.warn('Failed to save booking data:', error);
  }
};

// Get booking data for a specific hotel
export const getBookingData = (hotelId) => {
  try {
    const allData = getStoredBookingData();
    const hotelData = allData[hotelId];
    
    if (!hotelData) return null;
    
    // Check if data is older than 24 hours (optional cleanup)
    const isExpired = Date.now() - hotelData.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearBookingData(hotelId);
      return null;
    }
    
    return hotelData;
  } catch (error) {
    console.warn('Failed to retrieve booking data:', error);
    return null;
  }
};

// Get all stored booking data
const getStoredBookingData = () => {
  try {
    const data = localStorage.getItem(BOOKING_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to parse stored booking data:', error);
    return {};
  }
};

// Clear booking data for a specific hotel
export const clearBookingData = (hotelId) => {
  try {
    const existingData = getStoredBookingData();
    delete existingData[hotelId];
    localStorage.setItem(BOOKING_DATA_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.warn('Failed to clear booking data:', error);
  }
};

// Clear all booking data
export const clearAllBookingData = () => {
  try {
    localStorage.removeItem(BOOKING_DATA_KEY);
  } catch (error) {
    console.warn('Failed to clear all booking data:', error);
  }
};

// Save general booking preferences (applies to all hotels)
export const saveBookingPreferences = (preferences) => {
  try {
    localStorage.setItem('kashiBnb_booking_preferences', JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save booking preferences:', error);
  }
};

// Get general booking preferences
export const getBookingPreferences = () => {
  try {
    const data = localStorage.getItem('kashiBnb_booking_preferences');
    return data ? JSON.parse(data) : {
      guestCount: {
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0
      }
    };
  } catch (error) {
    console.warn('Failed to retrieve booking preferences:', error);
    return {
      guestCount: {
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0
      }
    };
  }
};

// Utility to create booking data object
export const createBookingData = (startDate, endDate, guestCount, additionalData = {}) => {
  return {
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
    guestCount: { ...guestCount },
    ...additionalData
  };
};

// Utility to parse stored dates back to Date objects
export const parseStoredDates = (bookingData) => {
  if (!bookingData) return null;
  
  return {
    ...bookingData,
    startDate: bookingData.startDate ? new Date(bookingData.startDate) : null,
    endDate: bookingData.endDate ? new Date(bookingData.endDate) : null
  };
};
