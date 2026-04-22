import { FaBalanceScale, FaTimes } from "react-icons/fa";
import { useBookComparison } from "../../contexts/BookComparisonContext";

const FloatingComparisonButton = () => {
  const { compareCount, toggleCompareModal, compareList, removeFromCompare } = useBookComparison();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
      {/* Mini Preview of Compare Items */}
      {compareCount > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 mb-2 max-w-xs animate-fadeInUp">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
            {compareCount} book{compareCount > 1 ? "s" : ""} in comparison
          </p>
          <div className="flex gap-2">
            {compareList.slice(0, 3).map((book) => (
              <div key={book._id} className="relative group">
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFromCompare(book._id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
            {compareCount > 3 && (
              <div className="w-12 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">+{compareCount - 3}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Compare Button */}
      <button
        onClick={toggleCompareModal}
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
      >
        <FaBalanceScale />
        <span className="font-semibold">Compare ({compareCount})</span>
      </button>
    </div>
  );
};

export default FloatingComparisonButton;
