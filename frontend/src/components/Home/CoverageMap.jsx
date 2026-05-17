import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTruck } from "react-icons/fa";

const CoverageMap = () => {
  const mapRef = useRef(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(() => setCities([]));
  }, []);

  useEffect(() => {
    if (mapRef.current && cities.length > 0) {
      mapRef.current.innerHTML = "";
      cities.forEach((city) => {
        const dot = document.createElement("div");
        dot.className = "absolute bg-indigo-500 rounded-full animate-pulse";
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.left = `${city.lng * 2.5 + 40}%`;
        dot.style.top = `${city.lat * 1.2 - 10}%`;
        dot.title = city.name;
        mapRef.current.appendChild(dot);
      });
    }
  }, [cities]);

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
          className="relative w-full h-80 md:h-96 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-600"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Bangladesh_location_map.svg"
            alt="Bangladesh Map"
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div ref={mapRef} className="absolute top-0 left-0 w-full h-full"></div>

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaTruck className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Delivery Coverage</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cities.length > 0 ? `${cities.length} cities covered` : "Loading cities..."}
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
