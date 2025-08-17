import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND, getAuthHeader } from '../../assets/Vars';
import { FiStar, FiMessageSquare, FiSend, FiEdit3, FiTrash2 } from 'react-icons/fi';

const HotelReviews = ({ hotelId, isOwnerOrAdmin }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    content: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (hotelId) {
      fetchReviews();
    }
  }, [hotelId]); // Added proper dependency

  // Separate useEffect for user bookings
  useEffect(() => {
    if (token && user && hotelId) {
      fetchUserBookings();
    }
  }, [token, user, hotelId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${BACKEND}/api/v1/hotel/hotel/${hotelId}/reviews`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(`${BACKEND}/api/v1/hotel/hotel/bookings/rateable`, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });
      
      // Filter bookings for this specific hotel
      const hotelBookings = response.data.bookings.filter(
        booking => booking.hotelId === hotelId && !booking.review
      );
      setUserBookings(hotelBookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      
      // Don't redirect on network errors, just show user-friendly message
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please log in to submit reviews');
      } else {
        setError('Failed to load your bookings. Please try again later.');
      }
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
        hotelId,
        bookingId: selectedBooking,
        content: reviewForm.content,
        rating: reviewForm.rating
      }, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });

      setSuccess('Review submitted successfully!');
      setReviewForm({ content: '', rating: 5 });
      setSelectedBooking('');
      setShowReviewForm(false);
      
      // Refresh reviews and user bookings
      fetchReviews();
      fetchUserBookings();
      
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

  const handleToggleReviewVisibility = async (reviewId, isVisible) => {
    try {
      await axios.patch(`${BACKEND}/api/v1/hotel/review/${reviewId}/visibility`, {
        isVisible
      }, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });
      
      // Refresh reviews to show updated visibility
      fetchReviews();
    } catch (error) {
      console.error('Error updating review visibility:', error);
    }
  };

  const canReview = userBookings.length > 0 && token && user;

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive ? () => onStarClick(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <FiStar
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
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
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiMessageSquare className="mr-2" />
          Guest Reviews
        </h2>
        
        {canReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiEdit3 className="mr-2" />
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && canReview && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Booking
              </label>
              <select
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a booking to review</option>
                {userBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {new Date(booking.from).toLocaleDateString()} - {new Date(booking.to).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

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
                <FiSend className="mr-2" />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiMessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {review.user.first_name?.[0] || review.user.name?.[0] || 'G'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.user.first_name && review.user.last_name
                        ? `${review.user.first_name} ${review.user.last_name}`
                        : review.user.name || 'Guest'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {isOwnerOrAdmin && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleReviewVisibility(review.id, !review.isVisible)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        review.isVisible
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {review.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-3">
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* No Bookings Message */}
      {!canReview && token && user && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            You need to complete a booking to write a review for this property.
          </p>
        </div>
      )}

      {!token && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Please log in to see reviews and write your own.
          </p>
        </div>
      )}
    </div>
  );
};

export default HotelReviews;
