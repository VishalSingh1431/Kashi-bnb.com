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
            {/* Background Images */}
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

            {/* Text Overlay */}
            <div className="absolute top-1/2 left-1/2 bg-white/70 backdrop-blur-sm rounded-2xl transform -translate-x-1/2 -translate-y-1/2 text-center p-6 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight drop-shadow-lg">
                    🏡 Homestay & Guesthouse Owners:<br className="hidden sm:block" />
                    <span className="text-purple-700">Ditch High Commissions</span> from Airbnb & MMT!<br />
                    <span className="text-black">Go Local with <span className="text-purple-700">KashiBnB</span> — Earn More 💰, Stress Less 🧘</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-800">
                    🧳 Tourists: Save More ➡️ Enjoy More 😍 with <span className="font-semibold text-purple-700">KashiBnB's Trust & Hospitality</span>!
                </p>
            </div>

            {/* Prev Button */}
            <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition"
                aria-label="Previous Slide"
            >
                ❮
            </button>

            {/* Next Button */}
            <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition"
                aria-label="Next Slide"
            >
                ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
