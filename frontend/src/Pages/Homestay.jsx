import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../Components/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter } from "react-icons/fi";
import { BACKEND } from "../assets/Vars";
import { FiChevronDown } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';  

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
        const allHotels = response.data.hotels || [];
        setHotels(allHotels);
        setFilteredHotels(allHotels);
      } catch (err) {
        setError("Failed to load hotels. Showing demo properties instead.");
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    let results = hotels;
    
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
    
    results = results.filter(hotel => 
      hotel.rate >= priceRange[0] && hotel.rate <= priceRange[1]
    );
    
    switch (sortOption) {
      case "price-low":
        results.sort((a, b) => a.rate - b.rate);
        break;
      case "price-high":
        results.sort((a, b) => b.rate - a.rate);
        break;
      case "rating-high":
        results.sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0));
        break;
      case "rating-low":
        results.sort((a, b) => (a.averageRating || a.rating || 0) - (b.averageRating || b.rating || 0));
        break;
      case "recommended":
      default:
        break;
    }
    
    setFilteredHotels(results);
  }, [hotels, searchQuery, priceRange, sortOption]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 flex flex-col items-center min-h-screen -mt-60 relative z-20">
      <div 
        className="shadow-lg w-full max-w-6xl rounded-2xl h-fit items-center mx-auto m-5 overflow-hidden relative z-30" 
        style={{ backgroundColor: '#f3eadb' }}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-6 p-4 rounded-2xl transition-colors text-gray-800 mx-auto" 
          style={{ backgroundColor: '#f3eadb', maxWidth: 'fit-content' }}
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          Discover Kashi, Book Your Stay Now
        </motion.h1>

        {/* Search Bar */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl rounded-lg mx-4" style={{ backgroundColor: '#f3eadb' }}>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center rounded-full p-1.5 sm:p-2 shadow-md mx-auto focus-within:outline-none focus-within:ring-0" 
                   style={{ backgroundColor: '#f3eadb' }}>
                <div className="flex-1 px-2 sm:px-3 flex items-center">
                  <FiSearch className="mr-2 text-base sm:text-lg" />
                  <input 
                    type="text"
                    placeholder="Search by hotel name, amenities, or keywords..."
                    className="w-full text-sm sm:text-base text-black font-bold bg-transparent placeholder-gray-600 border-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent focus:border-0"
                    style={{ 
                      border: 'none', 
                      boxShadow: 'none',
                      outline: 'none'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <button
                  type="submit"
                  className="p-1.5 sm:p-2 rounded-full transition-colors ml-2 hover:bg-gray-200 focus:outline-none focus:ring-0"
                >
                  <FiSearch className="text-base sm:text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="w-full flex justify-center mb-6 relative z-40">
          <div className="w-full max-w-6xl mx-4" style={{ backgroundColor: '#f3eadb' }}>
            <div className="flex flex-col sm:flex-row sm:flex-nowrap justify-between items-center gap-3">
              <div className="flex flex-row flex-nowrap gap-3 w-full sm:w-auto justify-start overflow-x-auto">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center whitespace-nowrap space-x-2 rounded-full px-4 py-3 hover:shadow-lg text-sm bg-orange-500 backdrop-blur-sm relative z-50 focus:outline-none focus:ring-0 active:outline-none active:ring-0 m-2 select-none text-white"
                  style={{ 
                    backgroundColor: '#f97316',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <FiFilter size={14} />
                  <span>Filters</span>
                </button>
                
                <div className="relative rounded-3xl w-auto bg-orange-500 backdrop-blur-sm z-50 m-2 select-none text-white" style={{ border: 'none', outline: 'none' }}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-auto rounded-full px-4 py-3 appearance-none hover:shadow-lg transition-all duration-200 pr-8 text-sm focus:outline-none focus:ring-0 bg-transparent text-white"
                    style={{ 
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      color: 'white'
                    }}
                  >
                    <option value="recommended" className="text-black">Recommended</option>
                    <option value="price-low" className="text-black">Price: Low to High</option>
                    <option value="price-high" className="text-black">Price: High to Low</option>
                    <option value="rating-high" className="text-black">Rating: High to Low</option>
                    <option value="rating-low" className="text-black">Rating: Low to High</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <FiChevronDown size={14} className="text-white" />
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 font-medium">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'property' : 'properties'} found
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 rounded-lg shadow-sm mx-auto max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl relative z-50 bg-white/80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-black">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-base text-black hover:text-gray-700 focus:outline-none focus:ring-0"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-base font-medium text-gray-700 mb-2">Price Range (₹)</h4>
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer border-0 focus:outline-none focus:ring-0"
                    />
                    <div className="text-base text-gray-600 whitespace-nowrap font-medium">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-6xl mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      <div className="w-full max-w-fit">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black-500"></div>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-5">
            {filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                name={hotel.name}
                price={hotel.rate || "N/A"}
                image={hotel.image || "#"}
                images={hotel.images}
                rating={hotel.averageRating || hotel.rating}
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
