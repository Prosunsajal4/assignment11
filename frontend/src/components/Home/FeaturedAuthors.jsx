import { Link } from "react-router-dom";

const authors = [
  {
    id: 1,
    name: "Humayun Ahmed",
    avatar:
      "https://m.media-amazon.com/images/M/MV5BMTJlYjQzNTgtNTA5NS00ODJkLThjZWMtOGZiOTZiZDNlNTBkXkEyXkFqcGc@._V1_.jpg",
    genre: "Bengali Fiction",
    books: 250,
    description:
      "Legendary Bangladeshi author known for his captivating storytelling.",
  },
  {
    id: 2,
    name: "Rabindranath Tagore",
    avatar:
      "https://www.nobelprize.org/images/tagore-12892-content-portrait-mobile-tiny.jpg",
    genre: "Poetry & Literature",
    books: 100,
    description: "Nobel laureate poet who revolutionized Bengali literature.",
  },
  {
    id: 3,
    name: "Sarat Chandra",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbeFEoT9pdFhMC5zkegpfozc5GR7Doxl6x-fjpOd0tAm3GY6k4Hzl3h7cKy98cOlG1KJk1m66KaxE6lk9d_qkl1JJGJZRXgQvLrsKnmt0&s=10",
    genre: "Classic Fiction",
    books: 30,
    description: "Master storyteller of human emotions and social issues.",
  },
  {
    id: 4,
    name: "Kazi Nazrul Islam",
    avatar: "https://en.banglapedia.org/images/0/05/IslamKaziNazrul.jpg",
    genre: "Poetry & Music",
    books: 75,
    description: "The rebel poet who inspired generations with his words.",
  },
];

const FeaturedAuthors = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 text-amber-700 dark:text-amber-300 text-sm font-semibold rounded-full mb-4">
            ✍️ Literary Icons
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Authors
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover books from renowned authors who have shaped literature
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <div
              key={author.id}
              className="group relative bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-500" />

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 scale-110" />
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="relative w-28 h-28 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-xl transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {author.books}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {author.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full mb-3">
                  {author.genre}
                </span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {author.description}
                </p>

                {/* Stats */}
                <div className="flex justify-center items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {author.books}
                    </div>
                    <div className="text-xs text-gray-400">Books</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                  <Link
                    to="/books"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                  >
                    View Books
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuthors;
