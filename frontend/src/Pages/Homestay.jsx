import React from "react";
// import Card from "/Card"; // Ensure the correct path to your Card component
import { motion } from "framer-motion";
import Card from "../Components/Card";

const Homestay = () => {
    // Animation for the heading
    const headingVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
    };

    return (
        <div className="p-4 flex flex-col items-cente ">
            {/* Animated Heading */}
            <motion.h1
                className="text-4xl font-bold text-center mb-8 bg-blue-300 p-2 rounded-2xl hover:bg-blue-600 "
                variants={headingVariants}
                initial="hidden"
                animate="visible"
            >
                Book Your Dream Homestay in Kashi Today
            </motion.h1>


            {/* Responsive Card Grid - Centered */}
            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* <Card
                        name="Guranteed Virgin"
                        price="69"  // Just pass the number, rupee symbol is added in the component
                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2XQlfxscGl9L5SM75BVSLJRgIpLaGwlMaug&s"
                        options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
                    /> */}
                    <Card
                        name="Premium Suite"
                        price="199"  // Just pass the number, rupee symbol is added in the component
                        image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
                        options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
                    />
                    <Card
                        name="Premium Suite"
                        price="199"  // Just pass the number, rupee symbol is added in the component
                        image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
                        options={["Free WiFi",  "Breakfast Included", "Pool Access", "24/7 Support"]}
                    /> <Card
                        name="Premium Suite"
                        price="199"  // Just pass the number, rupee symbol is added in the component
                        image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
                        options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
                    /> <Card
                        name="Premium Suite"
                        price="199"  // Just pass the number, rupee symbol is added in the component
                        image="https://kashibnb.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-25-at-1.05.58-PM-3-400x314.jpeg"
                        options={["Free WiFi", "Breakfast Included", "Pool Access", "24/7 Support"]}
                    />
                    {/* Add more cards as needed */}
                </div>
            </div>
        </div>
    );
};

export default Homestay;