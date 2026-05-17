import { FaRocket, FaBookOpen, FaSmile, FaShippingFast, FaShieldAlt, FaHeadset } from "react-icons/fa";

const features = [
  {
    icon: FaRocket,
    title: "Lightning Fast Delivery",
    description: "Get your books delivered within 2-3 business days to your doorstep.",
    color: "from-indigo-500 to-purple-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: FaBookOpen,
    title: "Vast Collection",
    description: "Browse thousands of books across every genre and language imaginable.",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: FaSmile,
    title: "Reader Satisfaction",
    description: "4.9/5 average rating from over 50,000 happy readers worldwide.",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: FaShippingFast,
    title: "Free Shipping",
    description: "Enjoy free delivery on your first order and competitive rates thereafter.",
    color: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    iconBg: "bg-pink-100 dark:bg-pink-900/40",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Payments",
    description: "Your transactions are protected with industry-leading encryption.",
    color: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Our dedicated team is always here to help with any questions.",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
];

const WhyChooseBookCourier = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
          Why Choose Us
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Why{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            BookCourier
          </span>
          ?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          We combine passion for books with exceptional service to deliver the best reading experience.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative ${feature.bgLight} rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}
          >
            {/* Icon */}
            <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`text-2xl ${feature.iconColor}`} />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>

            {/* Decorative Arrow */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <svg
                className={`w-5 h-5 ${feature.iconColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold"
              >
                {String.fromCodePoint(0x1f4da + i)}
              </div>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-white">50,000+</span> readers trust us for their next great read
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseBookCourier;
