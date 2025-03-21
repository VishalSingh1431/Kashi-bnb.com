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
        <div className="relative w-full h-screen overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            {/* Centered Text */}
            <div className="absolute top-1/2 left-1/2 bg-black/10 rounded-2xl transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-6 w-11/12 md:w-2/3 lg:w-1/2">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">Explore Varanasi, The Oldest City</h1>
                <h2 className="text-lg sm:text-xl mt-2 drop-shadow-md">Location Search</h2>

                {/* Buttons with Links */}
                <ul className="flex flex-wrap justify-center gap-3 mt-4">
                    <li>
                        <a href="/restaurants" className="flex items-center bg-white text-black px-3 py-2 rounded-md shadow-md hover:bg-red-400 transition">
                            <img className="h-6 w-6 mr-2" src="/images/fork.png" alt="Restaurant" />
                            <span className="font-semibold">Restaurant</span>
                        </a>
                    </li>
                    <li>
                        <a href="/hotels" className="flex items-center bg-white text-black px-3 py-2 rounded-md shadow-md hover:bg-red-400 transition">
                            <img className="h-6 w-6 mr-2" src="/images/hotel.png" alt="Hotel" />
                            <span className="font-semibold">Hotel</span>
                        </a>
                    </li>
                    <li>
                        <a href="/locations" className="flex items-center bg-white text-black px-3 py-2 rounded-md shadow-md hover:bg-red-400 transition">
                            <img className="h-6 w-6 mr-2" src="/images/location.png" alt="Location" />
                            <span className="font-semibold">Location</span>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-md hover:bg-opacity-75"
            >
                &lt;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-md hover:bg-opacity-75"
            >
                &gt;
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white w-4 h-4' : 'bg-gray-500'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
