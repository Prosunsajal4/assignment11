import { Link } from "react-router-dom";
import { FaBook, FaLandmark, FaSkullCrossbones, FaLaugh, FaTheaterMasks, FaSearch, FaQuestion } from "react-icons/fa";
import { SiStorybook } from "react-icons/si";

const categories = [
  {
    id: 1,
    name: "Fiction",
    icon: FaBook,
    count: 8,
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    hoverBg: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    name: "Historical",
    icon: FaLandmark,
    count: 4,
    gradient: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
    hoverBg: "from-cyan-500 to-blue-600",
  },
  {
    id: 3,
    name: "Thriller",
    icon: FaSkullCrossbones,
    count: 3,
    gradient: "from-red-500 to-pink-600",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    hoverBg: "from-red-500 to-pink-600",
  },
  {
    id: 4,
    name: "Humor",
    icon: FaLaugh,
    count: 3,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    hoverBg: "from-amber-500 to-orange-600",
  },
  {
    id: 5,
    name: "Novel",
    icon: SiStorybook,
    count: 1,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    hoverBg: "from-emerald-500 to-teal-600",
  },
  {
    id: 6,
    name: "Mystery",
    icon: FaSearch,
    count: 1,
    gradient: "from-purple-500 to-pink-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    hoverBg: "from-purple-500 to-pink-600",
  },
  {
    id: 7,
    name: "Drama",
    icon: FaTheaterMasks,
    count: 1,
    gradient: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    hoverBg: "from-pink-500 to-rose-600",
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
            Browse Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Explore by{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Dive into our diverse collection organized by genre and topic
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              to={`/books?category=${category.name}`}
              key={category.id}
              className={`group relative ${category.bgLight} rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110`}>
                  <category.icon className={`text-2xl text-gray-700 dark:text-gray-200 group-hover:text-white transition-colors`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300 mb-1">
                  {category.name}
                </h3>

                {/* Count */}
                <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors duration-300">
                  {category.count} {category.count === 1 ? "book" : "books"}
                </p>

                {/* Arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                  <svg
                    className="w-4 h-4 text-white"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
