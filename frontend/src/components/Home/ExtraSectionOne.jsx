import { FaSearch, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FaSearch,
    step: "01",
    title: "Browse & Discover",
    description: "Explore our vast collection of books across every genre and find your next favorite read.",
    gradient: "from-indigo-500 to-purple-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    icon: FaShoppingCart,
    step: "02",
    title: "Order Securely",
    description: "Place your order with confidence using our secure payment options and encrypted checkout.",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: FaBoxOpen,
    step: "03",
    title: "Receive & Enjoy",
    description: "Get your books delivered to your doorstep and start your reading adventure right away!",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const ExtraSectionOne = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
          Simple Process
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          How It{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Get your favorite books in three easy steps
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-amber-200 dark:from-indigo-800 dark:via-purple-800 dark:to-amber-800" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`relative ${step.bgLight} rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            {/* Step Number */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br ${step.gradient} text-white text-xs font-bold rounded-full shadow-lg`}>
                {step.step}
              </span>
            </div>

            {/* Icon */}
            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6`}>
              <step.icon className="text-2xl text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {step.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExtraSectionOne;
