import { FaStar, FaQuoteLeft } from "react-icons/fa";

const TestimonialCard = ({ name, role, avatar, rating, text, delay = 0 }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote Icon */}
      <FaQuoteLeft className="text-indigo-100 dark:text-indigo-900 text-4xl mb-4" />
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar 
            key={i} 
            className={i < rating ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"} 
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        "{text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <img 
          src={avatar || "/placeholder-avatar.jpg"} 
          alt={name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700"
        />
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
    cyan: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {Icon && <Icon className="w-7 h-7" />}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`glass rounded-2xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export { TestimonialCard, FeatureCard, GlassCard };
