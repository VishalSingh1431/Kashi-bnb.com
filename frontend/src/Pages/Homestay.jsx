import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../Components/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter } from "react-icons/fi";
import { BACKEND } from "../assets/Vars";

const Homestay = () => {
  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("recommended");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BACKEND}/api/v1/hotel/hotels`);
        // Combine API hotels with additional static hotels
        const allHotels = [
          ...(response.data.hotels || []),
          {
            id: "premium-suite",
            name: "Premium Suite",
            rate: 1999,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Luxurious suite with premium amenities",
            s1: "Free WiFi",
            s2: "Breakfast Included",
            s3: "Pool Access",
            s4: "24/7 Support",
            rating: 4.8
          },
          {
            id: "luxury-villa",
            name: "Luxury Villa",
            rate: 2999,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Spacious villa with modern facilities",
            s1: "AC",
            s2: "Parking",
            s3: "Kitchen",
            s4: "Laundry",
            rating: 4.9
          },
          {
            id: "budget-room",
            name: "Budget Room",
            rate: 999,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Affordable accommodation with basic amenities",
            s1: "WiFi",
            s2: "24/7 Support",
            s3: "TV",
            s4: "Attached Bath",
            rating: 4.2
          },
          {
            id: "river-view-suite",
            name: "River View Suite",
            rate: 2499,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Beautiful view of the Ganges river",
            s1: "Ganga View",
            s2: "AC",
            s3: "Breakfast",
            s4: "Free WiFi",
            rating: 4.7
          },
          {
            id: "family-apartment",
            name: "Family Apartment",
            rate: 3499,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Perfect for family stays with multiple rooms",
            s1: "3 Bedrooms",
            s2: "Kitchen",
            s3: "Living Area",
            s4: "Parking",
            rating: 4.5
          }
        ];
        setHotels(allHotels);
        setFilteredHotels(allHotels);
      } catch (err) {
        // console.error("Error fetching hotels:", err);
        setError("Failed to load hotels. Showing demo properties instead.");
        // Fallback to static hotels if API fails
        const fallbackHotels = [
          {
            id: "premium-suite",
            name: "Premium Suite",
            rate: 1999,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Luxurious suite with premium amenities",
            s1: "Free WiFi",
            s2: "Breakfast Included",
            s3: "Pool Access",
            s4: "24/7 Support",
            rating: 4.8
          },
          {
            id: "luxury-villa",
            name: "Luxury Villa",
            rate: 2999,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Spacious villa with modern facilities",
            s1: "AC",
            s2: "Parking",
            s3: "Kitchen",
            s4: "Laundry",
            rating: 4.9
          },
          {
            id: "budget-room",
            name: "Budget Room",
            rate: 999,
            image: "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg",
            city: "Varanasi",
            description: "Affordable accommodation with basic amenities",
            s1: "WiFi",
            s2: "24/7 Support",
            s3: "TV",
            s4: "Attached Bath",
            rating: 4.2
          }
        ];
        setHotels(fallbackHotels);
        setFilteredHotels(fallbackHotels);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    // Apply filters whenever search criteria change
    let results = hotels;
    
    // Apply search query filter across all fields (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(hotel =>
        (hotel.name && hotel.name.toLowerCase().includes(query)) ||
        (hotel.description && hotel.description.toLowerCase().includes(query)) ||
        (hotel.city && hotel.city.toLowerCase().includes(query)) ||
        (hotel.s1 && hotel.s1.toLowerCase().includes(query)) ||
        (hotel.s2 && hotel.s2.toLowerCase().includes(query)) ||
        (hotel.s3 && hotel.s3.toLowerCase().includes(query)) ||
        (hotel.s4 && hotel.s4.toLowerCase().includes(query))
      );
    }
    
    // Apply price range filter
    results = results.filter(hotel => 
      hotel.rate >= priceRange[0] && hotel.rate <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case "price-low":
        results.sort((a, b) => a.rate - b.rate);
        break;
      case "price-high":
        results.sort((a, b) => b.rate - a.rate);
        break;
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "recommended":
      default:
        // Default sorting (could be based on some recommendation algorithm)
        break;
    }
    
    setFilteredHotels(results);
  }, [hotels, searchQuery, priceRange, sortOption]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is already handled in the useEffect
  };

  return (
    <div className="p-4 flex flex-col items-center min-h-screen" style={{ backgroundColor: '#f3eadb' }}>
      <motion.h1
        className="text-4xl font-bold text-center mb-8 p-4 rounded-2xl transition-colors text-gray-800" style={{ backgroundColor: '#f3eadb' }}
        variants={headingVariants}
        initial="hidden"
        animate="visible"
      >
        Book Your Dream Homestay Today
      </motion.h1>

      {/* Search Bar */}
      <div className="w-full max-w-4xl mb-8 rounded-lg" style={{ backgroundColor: '#f3eadb' }}>
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center border rounded-full p-3 shadow-sm" style={{ backgroundColor: '#f3eadb' }}>
            <div className="flex-1 px-4 flex items-center ">
              <FiSearch className="mr-3" />
              <input 
                
                type="text"
                placeholder="Search by hotel name, amenities, or keywords..."
                className="w-full  text-black font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className=" p-3 rounded-full transition-colors ml-2"
            >
              <FiSearch size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Sorting */}
      <div className="w-full max-w-6xl mb-8" style={{ backgroundColor: '#f3eadb' }}>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border rounded-full px-4 py-2 hover:shadow-md \" style={{ backgroundColor: '#f3eadb' }}
            >
              <FiFilter />
              <span>Filters</span>
            </button>
            
            <div className="relative border rounded-3xl">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-200 rounded-full px-4 py-2 appearance-none hover:shadow-md transition-shadow pr-8" style={{ backgroundColor: '#f3eadb' }}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          
          <div className="text-gray-600">
            {filteredHotels.length} {filteredHotels.length === 1 ? 'property' : 'properties'} found
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-6 border border-gray-100 rounded-lg shadow-sm bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Close
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range (₹)</h4>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-6xl mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      <div className="w-full max-w-6xl">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
            {filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                name={hotel.name}
                price={hotel.rate || "N/A"}
                image={hotel.image || "https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"}
                rating={hotel.rating}
                options={[
                  hotel.s1 || "Free WiFi",
                  hotel.s2 || "Breakfast Included",
                  hotel.s3 || "24/7 Support",
                  hotel.s4 || "Comfortable Stay"
                ]}
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homestay;