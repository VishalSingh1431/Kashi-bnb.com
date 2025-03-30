import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../Components/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Homestay = () => {
  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  const [hotels, setHotels] = useState([]); // Initialize as array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("https://kashi-bnb-production.up.railway.app/api/v1/hotel/hotels");
        // console.log(response.data.hotels); // Log the actual data
        setHotels(response.data.hotels || []); // Use empty array as fallback
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 bg-blue-300 p-2 rounded-2xl hover:bg-blue-600"
        variants={headingVariants}
        initial="hidden"
        animate="visible"
      >
        Book Your Dream Homestay in Kashi Today
      </motion.h1>

      <div className="flex justify-center">
        {loading ? (
          <p>Loading hotels...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <Card
                  key={hotel.id} // Unique key for each card
                  name={hotel.name}
                  price="199" // Replace with hotel.price if available
                  image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
                  options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
                  onClick={() => {
                    console.log(hotel.id); // Log the specific hotel’s id
                    navigate(`/hotel/${hotel.id}`); // Navigate using this hotel’s id
                  }}
                />
              ))
            ) : (
              <p>No hotels available</p>
            )}
            {/* Static Cards (optional, remove if not needed) */}
            <Card
              name="Premium Suite"
              price="199"
              image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
              options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
              onClick={() => navigate("/hotel/static-premium-suite")} // Example static ID
            />
            {/* <Card
                        name="ABC"
                        price="69"  // Just pass the number, rupee symbol is added in the component
                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2XQlfxscGl9L5SM75BVSLJRgIpLaGwlMaug&s"
                        options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
                    /> */}
          
            <Card
              name={hotels[0]?.name}
              price={hotels[0]?.rate}
              image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
              options={[hotels[0].s1, hotels[0].s2, hotels[0].s3, hotels[0].s4]}
              onClick={() => navigate(`hotel/${hotels[0]?.id}`)}
            />
            <Card
              name={hotels[0]?.name}
              price={hotels[0]?.rate}
              image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
              options={[hotels[0].s1, hotels[0].s2, hotels[0].s3, hotels[0].s4]}
              onClick={() => navigate(`hotel/${hotels[0]?.id}`)}
            />
            <Card
              name={hotels[0]?.name}
              price={hotels[0]?.rate}
              image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
              options={[hotels[0].s1, hotels[0].s2, hotels[0].s3, hotels[0].s4]}
              onClick={() => navigate(`hotel/${hotels[0]?.id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Homestay;