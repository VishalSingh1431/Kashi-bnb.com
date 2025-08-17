import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND, getAuthHeader } from '../../assets/Vars';
import { FiStar, FiMessageSquare, FiEdit3, FiTrash2, FiCalendar, FiMapPin } from 'react-icons/fi';

const RatingAndReviews = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    content: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token and user once when component mounts
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Only fetch if we have both token and user
    if (token && user && user.id) {
      fetchBookings();
    } else {
      setLoading(false);
      setError('Please log in to view your bookings');
    }
  }, []); // Empty dependency array - only run once on mount

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      const response = await axios.get(`${BACKEND}/api/v1/hotel/hotel/bookings/rateable`, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      // Don't redirect on network errors, just show user-friendly message
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please log in again to view your bookings');
      } else {
        setError('Failed to load your bookings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBooking) {
      setError('Please select a booking to review');
      return;
    }

    if (reviewForm.content.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await axios.post(`${BACKEND}/api/v1/hotel/hotel/review`, {
        hotelId: selectedBooking.hotelId,
        bookingId: selectedBooking.id,
        content: reviewForm.content,
        rating: reviewForm.rating
      }, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });

      setSuccess('Review submitted successfully!');
      setReviewForm({ content: '', rating: 5 });
      setSelectedBooking(null);
      setShowReviewForm(false);
      
      // Refresh bookings
      fetchBookings();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const openReviewForm = (booking) => {
    setSelectedBooking(booking);
    setShowReviewForm(true);
    setReviewForm({
      content: booking.review?.content || '',
      rating: booking.rating?.rating || 5
    });
  };

  const closeReviewForm = () => {
    setShowReviewForm(false);
    setSelectedBooking(null);
    setReviewForm({ content: '', rating: 5 });
    setError('');
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive ? () => onChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            <FiStar className="w-5 h-5" fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiMessageSquare className="mr-2" />
              Rate & Review Your Stays
            </h2>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && selectedBooking && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Write a Review</h3>
                <button
                  onClick={closeReviewForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900">{selectedBooking.hotel.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FiCalendar className="mr-1" />
                  {new Date(selectedBooking.from).toLocaleDateString()} - {new Date(selectedBooking.to).toLocaleDateString()}
                </div>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {renderStars(reviewForm.rating, true, handleRatingChange)}
                    <span className="ml-2 text-sm text-gray-600">
                      {reviewForm.rating} out of 5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience with this property..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    required
                    minLength="10"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 10 characters required
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={closeReviewForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiMessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No completed bookings to review</p>
              <p className="text-sm">Complete a stay to leave a review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {booking.hotel.images && booking.hotel.images.length > 0 && (
                          <img
                            src={booking.hotel.images[0].url}
                            alt={booking.hotel.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.hotel.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FiCalendar className="mr-1" />
                            {new Date(booking.from).toLocaleDateString()} - {new Date(booking.to).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {booking.rating && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm text-gray-600">Your rating:</span>
                          {renderStars(booking.rating.rating)}
                        </div>
                      )}
                      
                      {booking.review && (
                        <div className="mt-2 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">{booking.review.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed on {new Date(booking.review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {!booking.review ? (
                        <button
                          onClick={() => openReviewForm(booking)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FiEdit3 className="mr-2" />
                          Write Review
                        </button>
                      ) : (
                        <div className="text-center">
                          <div className="text-green-600 text-sm font-medium mb-1">✓ Reviewed</div>
                          <button
                            onClick={() => openReviewForm(booking)}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Edit Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingAndReviews;
