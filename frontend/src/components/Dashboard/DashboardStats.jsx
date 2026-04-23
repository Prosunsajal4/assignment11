import {
  FaUsers,
  FaBook,
  FaShoppingCart,
  FaDollarSign,
  FaTrendingUp,
  FaTrendingDown,
} from "react-icons/fa";

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "indigo",
  progress = 75,
}) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
    cyan: "from-cyan-500 to-blue-600",
  };

  const bgClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20",
    amber: "bg-amber-50 dark:bg-amber-900/20",
    rose: "bg-rose-50 dark:bg-rose-900/20",
    cyan: "bg-cyan-50 dark:bg-cyan-900/20",
  };

  const iconColorClasses = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      {/* Gradient Background Accent */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-bl-full`}
      />

      <div className="p-6 relative">
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl ${bgClasses[color]} flex items-center justify-center`}
          >
            {icon &&
              (() => {
                const IconComp = icon;
                return (
                  <IconComp className={`w-7 h-7 ${iconColorClasses[color]}`} />
                );
              })()}
          </div>

          {/* Trend */}
          {trend && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                trend === "up"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              }`}
            >
              {trend === "up" ? <FaTrendingUp /> : <FaTrendingDown />}
              {trendValue}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
            {value}
          </h3>
        </div>

        {/* Progress Bar (decorative) */}
        <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ stats }) => {
  const defaultStats = {
    totalUsers: "2,450",
    totalBooks: "12,890",
    totalOrders: "8,234",
    revenue: "$45,678",
  };

  const data = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Users"
        value={data.totalUsers}
        icon={FaUsers}
        trend="up"
        trendValue="12%"
        color="indigo"
      />
      <StatsCard
        title="Total Books"
        value={data.totalBooks}
        icon={FaBook}
        trend="up"
        trendValue="8%"
        color="emerald"
      />
      <StatsCard
        title="Total Orders"
        value={data.totalOrders}
        icon={FaShoppingCart}
        trend="up"
        trendValue="24%"
        color="amber"
      />
      <StatsCard
        title="Revenue"
        value={data.revenue}
        icon={FaDollarSign}
        trend="up"
        trendValue="18%"
        color="rose"
      />
    </div>
  );
};

export { StatsCard, DashboardStats };
export default DashboardStats;
