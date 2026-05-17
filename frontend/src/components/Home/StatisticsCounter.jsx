import { useEffect, useState } from "react";
import { FaBook, FaUsers, FaStore, FaBoxOpen } from "react-icons/fa";

const staticStats = [
  { label: "Books Available", value: 21, suffix: "+", icon: FaBook, color: "from-indigo-400 to-purple-500" },
  { label: "Happy Customers", value: 150, suffix: "+", icon: FaUsers, color: "from-emerald-400 to-teal-500" },
  { label: "Active Sellers", value: 8, suffix: "+", icon: FaStore, color: "from-amber-400 to-orange-500" },
  { label: "Orders Delivered", value: 85, suffix: "+", icon: FaBoxOpen, color: "from-pink-400 to-rose-500" },
];

const StatCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
    return num.toLocaleString();
  };

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

const StatisticsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    const section = document.getElementById("stats-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats-section"
      className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-4 border border-white/20">
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Journey in{" "}
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Trusted by thousands of book lovers and sellers across the country
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {staticStats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 group-hover:bg-white/15 group-hover:scale-105 transition-all duration-300" />

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <stat.icon className="text-2xl text-white" />
                </div>

                {/* Counter */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {isVisible ? (
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  ) : (
                    "0"
                  )}
                </div>

                {/* Label */}
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsCounter;
