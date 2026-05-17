import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Book Enthusiast",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    comment:
      "BookCourier has completely transformed how I discover new books. The delivery is fast and the selection is amazing!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Avid Reader",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    comment:
      "I love supporting local sellers through this platform. The quality of service is exceptional and prices are fair.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Literature Professor",
    avatar: "https://i.pravatar.cc/150?img=48",
    rating: 5,
    comment:
      "As someone who needs books frequently for my classes, BookCourier has been a lifesaver. Highly recommended!",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=60",
    rating: 4,
    comment:
      "Great platform for finding textbooks and novels alike. The wishlist feature is super helpful for tracking books.",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Book Collector",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    comment:
      "The rare book collection here is incredible. I've found editions I couldn't find anywhere else!",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Indie Author",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    comment:
      "As a seller, the platform is intuitive and the support team is fantastic. Great community of book lovers!",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from real readers who have experienced the joy of BookCourier
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                index === activeIndex
                  ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900"
                  : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaQuoteLeft className="text-white text-sm" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < testimonial.rating
                        ? "text-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900/50"
                />
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 h-3 bg-indigo-600"
                  : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
