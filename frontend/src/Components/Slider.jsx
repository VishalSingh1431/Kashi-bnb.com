import React, { useState, useEffect } from 'react';

const Slider = () => {
    const images = [
        "https://www.agoda.com/wp-content/uploads/2024/09/varanasi-india-featured.jpg",
        "https://images.unsplash.com/photo-1558184525-2218e8c34914?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1840&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="relative">
            {/* Background Image Slider - Full width */}
            <div className="absolute inset-0 -z-10 w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Your Original Container - Not Changed At All */}
            <div className="min-h-screen pt-52 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Owners Section */}
                    <div className="flex-1  backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#f3eadb' }}>
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <span className="text-xl">🏡</span>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-4">
                                Hello Homestay/PG/Hotel Owners!
                            </h1>

                            <p className="text-lg font-semibold  mb-4 text-center">
                                Tired of paying 15-30% commissions on OTA Platforms like AirBnB or MMT?<br />
                                <span><em>Go Local with KashiBnB & Earn More!</em></span>
                            </p>

                            <ul className="space-y-1 mb-4">
                                <li className="flex items-start  p-3 rounded-lg">
                                    <span className=" mr-3 text-xl">💰</span>
                                    <span className="text-lg font-medium text-gray-800"><b>Keep 100% earnings</b> - Zero commission</span>
                                </li>
                                <li className="flex items-start  p-3 rounded-lg">
                                    <span className=" mr-3 text-xl">👨‍👩‍👧‍👦</span>
                                    <span className="text-lg font-medium text-gray-800"><b>Direct bookings</b> from travelers</span>
                                </li>
                                <li className="flex items-start  p-3 rounded-lg">
                                    <span className=" mr-3 text-xl">📈</span>
                                    <span className="text-lg font-medium text-gray-800"><b>Premium visibility</b> locally</span>
                                </li>
                            </ul>

                            <button className="bg-gradient-to-r  font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                                List Your Property FREE Today!
                            </button>
                        </div>
                    </div>


                    {/* Travelers Section */}
                    <div className="flex-1 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#f3eadb' }}>
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <span className="text-xl">🛕</span>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-4">
                                Dear Travelers!
                            </h1>

                            <p className="text-lg font-semibold  mb-4 text-center">
                                Why pay 15-30% more on OTA Platforms?<br />
                                <span className="font-bold">Sacred Stays in Varanasi</span>
                                <div><em>"Experience the spiritual heart of India for less"</em></div>
                            </p>

                            <ul className="space-y-1 mb-4">
                                <li className="flex items-start  p-3 rounded-lg">
                                    <span className="text-lg font-medium text-gray-800"><b>💰 Save 15-30%</b> on premium stays</span>
                                </li>
                                <li className="flex items-start  p-3 rounded-lg">
                                    <span className="text-lg font-medium text-gray-800"><b>🛡️ Physically audited</b> properties</span>
                                </li>
                                <li className="flex items-start  p-3 rounded-lg">
                                    <span className="text-lg font-medium text-gray-800"><b>🕉️ Empowering travelers,</b> hosts & ecosystem</span>
                                </li>
                            </ul>

                            <button className="bg-gradient-to-r  font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                                Book Authentic Kashi Stays!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
                aria-label="Previous Slide"
            >
                ❮
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
                aria-label="Next Slide"
            >
                ❯
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-white scale-125' : 'bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;