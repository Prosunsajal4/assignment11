import React from "react";
import { FaRocket, FaBookOpen, FaSmile, FaShippingFast } from "react-icons/fa";

const WhyChooseBookCourier = () => (
  <section className="py-16 bg-linear-to-r from-lime-100 to-blue-50">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-lime-700 mb-6 animate-fade-in">
        Why Choose BookCourier?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:scale-105 transition-transform duration-300 animate-fade-in">
          <FaRocket className="text-4xl text-lime-600 mb-3 animate-bounce" />
          <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
          <p>
            Get your books delivered quickly to your doorstep in major cities.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:scale-105 transition-transform duration-300 animate-fade-in">
          <FaBookOpen className="text-4xl text-blue-600 mb-3 animate-bounce" />
          <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
          <p>Choose from thousands of books across genres and authors.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:scale-105 transition-transform duration-300 animate-fade-in">
          <FaSmile className="text-4xl text-yellow-500 mb-3 animate-bounce" />
          <h3 className="font-semibold text-lg mb-2">Customer Satisfaction</h3>
          <p>Our customers love us for our service and support.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:scale-105 transition-transform duration-300 animate-fade-in">
          <FaShippingFast className="text-4xl text-pink-500 mb-3 animate-bounce" />
          <h3 className="font-semibold text-lg mb-2">Affordable Shipping</h3>
          <p>Enjoy low-cost shipping rates and special offers.</p>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseBookCourier;
