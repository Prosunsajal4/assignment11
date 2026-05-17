import { FaShieldAlt, FaHeadset, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const promises = [
  {
    icon: FaShieldAlt,
    title: "Quality Guaranteed",
    description: "We guarantee original, high-quality books for every order. If you're not satisfied, we'll make it right.",
    gradient: "from-indigo-500 to-purple-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Our dedicated team is always here to help you with any queries or issues, day or night.",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
  },
];

const ExtraSectionTwo = () => (
  <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
          Our Commitment
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Our{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Promise
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          We're committed to delivering the best book buying experience
        </p>
      </div>

      {/* Promise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {promises.map((item, index) => (
          <motion.div
            key={index}
            className={`relative ${item.bgLight} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            {/* Icon */}
            <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6`}>
              <item.icon className="text-2xl text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {item.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Checkmark */}
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <FaCheckCircle className="text-sm" />
              <span className="text-sm font-medium">Trusted by 50K+ readers</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExtraSectionTwo;
