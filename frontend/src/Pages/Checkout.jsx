import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { BACKEND, RZPKID } from "../assets/Vars";
const Razorpay = window.Razorpay;

const Checkout = () => {
  const { id: hotelId } = useParams();
  const location = useLocation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  useEffect(() => {
    if (!location.state) {
      nav(`/hotel/${hotelId}`);
      return;
    }
    setBookingDetails(location.state);
  }, [location.state, hotelId, nav]);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BACKEND}/api/v1/payments/order`,
        {
          amount: bookingDetails.total*100,
          hotelId,
          from: bookingDetails.startDate,
          to: bookingDetails.endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    //   console.log(data.bookingId);

      const options = {
        // key: process.env.RZPKID,
        key: RZPKID,
        amount: data.data.amount,
        currency: "INR",
        name: `Book@ ${bookingDetails.hotelName}`,
        description: "Booking Payment",
        image: "https://example.com/logo.png",
        order_id: data.data.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${BACKEND}/api/v1/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.bookingId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setPaymentStatus("success");
          } catch (error) {
            console.error("Verification failed:", error);
            setPaymentStatus("failed");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return null;

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <button
        onClick={() => nav(-1)}
        className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <FiArrowLeft className="mr-2" /> Back to Hotel
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>

        {paymentStatus === "success" ? (
          <div className="text-center py-12">
            <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. A confirmation email has been
              sent to your registered address.
            </p>
            <button
              onClick={() => nav("/my-bookings")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              View Bookings
            </button>
          </div>
        ) : paymentStatus === "failed" ? (
          <div className="text-center py-12">
            <FiXCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <button
              onClick={() => setPaymentStatus(null)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-medium">{bookingDetails.hotelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {new Date(bookingDetails.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {new Date(bookingDetails.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {bookingDetails.guests.adults} Adults,{" "}
                    {bookingDetails.guests.children} Children
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold">
                  ₹{bookingDetails.total}
                </span>
              </div>

              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>

              <p className="text-center mt-4 text-sm text-gray-600">
                Secure payment processing by Razorpay
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;