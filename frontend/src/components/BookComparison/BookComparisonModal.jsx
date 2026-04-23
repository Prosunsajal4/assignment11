import { FaTimes, FaBalanceScale, FaCheck, FaTrash } from "react-icons/fa";
import { useBookComparison } from "../../contexts/BookComparisonContext";
import { useNavigate } from "react-router-dom";

const BookComparisonModal = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompareList,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useBookComparison();

  const navigate = useNavigate();

  if (!isCompareModalOpen) return null;

  const compareFields = [
    { key: "name", label: "Title" },
    { key: "author", label: "Author" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", format: (v) => `$${v}` },
    { key: "quantity", label: "Stock" },
    { key: "rating", label: "Rating", format: (v) => (v ? `${v}/5` : "N/A") },
    { key: "description", label: "Description", truncate: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FaBalanceScale className="text-2xl text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Compare Books
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comparing {compareList.length} books
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompareList}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FaTrash />
              Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          {compareList.length === 0 ? (
            <div className="text-center py-12">
              <FaBalanceScale className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No books to compare. Add some books first!
              </p>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)`,
              }}
            >
              {/* Row Labels */}
              <div className="space-y-4">
                <div className="h-48" /> {/* Spacer for image row */}
                {compareFields.map((field) => (
                  <div
                    key={field.key}
                    className="h-16 flex items-center font-semibold text-gray-600 dark:text-gray-400 text-sm"
                  >
                    {field.label}
                  </div>
                ))}
              </div>

              {/* Book Columns */}
              {compareList.map((book) => (
                <div key={book._id} className="space-y-4">
                  {/* Book Image & Basic Info */}
                  <div className="h-48 relative group">
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-full h-full object-cover rounded-2xl cursor-pointer"
                      onClick={() => {
                        navigate(`/book/${book._id}`);
                        setIsCompareModalOpen(false);
                      }}
                    />
                    <button
                      onClick={() => removeFromCompare(book._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FaTimes className="text-red-500 text-sm" />
                    </button>
                  </div>

                  {/* Fields */}
                  {compareFields.map((field) => (
                    <div
                      key={field.key}
                      className="h-16 flex items-center text-gray-800 dark:text-gray-200 px-2"
                    >
                      {field.key === "name" ? (
                        <button
                          onClick={() => {
                            navigate(`/book/${book._id}`);
                            setIsCompareModalOpen(false);
                          }}
                          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left line-clamp-2"
                        >
                          {book[field.key]}
                        </button>
                      ) : (
                        <span
                          className={`${field.truncate ? "line-clamp-2 text-sm" : ""}`}
                        >
                          {field.format
                            ? field.format(book[field.key])
                            : book[field.key] || "N/A"}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* View Button */}
                  <div className="h-16 flex items-center">
                    <button
                      onClick={() => {
                        navigate(`/book/${book._id}`);
                        setIsCompareModalOpen(false);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                    >
                      View Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookComparisonModal;
