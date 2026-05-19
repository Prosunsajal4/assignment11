import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTruck } from "react-icons/fa";

const cities = [
  { name: "Dhaka", lat: 23.8103, lng: 90.4125, x: 55, y: 62 },
  { name: "Chittagong", lat: 22.3569, lng: 91.7832, x: 75, y: 78 },
  { name: "Khulna", lat: 22.8456, lng: 89.5403, x: 30, y: 72 },
  { name: "Rajshahi", lat: 24.3745, lng: 88.6042, x: 18, y: 38 },
  { name: "Sylhet", lat: 24.8949, lng: 91.8687, x: 78, y: 32 },
  { name: "Barisal", lat: 22.701, lng: 90.3535, x: 52, y: 80 },
  { name: "Rangpur", lat: 25.746, lng: 89.25, x: 22, y: 15 },
  { name: "Mymensingh", lat: 24.7471, lng: 90.4203, x: 55, y: 35 },
];

const CoverageMap = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
            Delivery Areas
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Coverage{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Map
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We deliver books to major cities across the country
          </p>
        </div>

        {/* Map Container */}
        <motion.div
          className="relative w-full h-80 md:h-[500px] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-600"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Stylized Bangladesh Map Background */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M20,10 L35,8 L50,12 L65,10 L75,15 L80,25 L85,35 L82,50 L78,60 L75,70 L70,80 L60,88 L50,92 L40,88 L30,82 L25,75 L20,65 L15,55 L12,45 L10,35 L12,25 L15,18 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-indigo-400 dark:text-indigo-300"
            />
            <path
              d="M20,10 L35,8 L50,12 L65,10 L75,15 L80,25 L85,35 L82,50 L78,60 L75,70 L70,80 L60,88 L50,92 L40,88 L30,82 L25,75 L20,65 L15,55 L12,45 L10,35 L12,25 L15,18 Z"
              fill="currentColor"
              className="text-indigo-200 dark:text-indigo-900/30"
            />
          </svg>

          {/* City Dots */}
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              className="absolute"
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            >
              {/* Pulse ring */}
              <div className="absolute -inset-2 bg-indigo-400/30 rounded-full animate-ping" />
              {/* Dot */}
              <div className="relative w-4 h-4 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg cursor-pointer group">
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {city.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                </div>
              </div>
              {/* City label */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                {city.name}
              </div>
            </motion.div>
          ))}

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaTruck className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Delivery Coverage</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cities.length} cities covered
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Active Delivery Zone</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoverageMap;
