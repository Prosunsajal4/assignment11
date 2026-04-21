import { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";

const BookComparisonContext = createContext();

export const BookComparisonProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const MAX_COMPARE_ITEMS = 4;

  const addToCompare = useCallback((book) => {
    setCompareList((prev) => {
      if (prev.some((b) => b._id === book._id)) {
        toast.info("Book already in comparison list");
        return prev;
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        toast.error(`You can compare up to ${MAX_COMPARE_ITEMS} books`);
        return prev;
      }
      toast.success("Added to comparison");
      return [...prev, book];
    });
  }, []);

  const removeFromCompare = useCallback((bookId) => {
    setCompareList((prev) => prev.filter((b) => b._id !== bookId));
    toast.success("Removed from comparison");
  }, []);

  const clearCompareList = useCallback(() => {
    setCompareList([]);
  }, []);

  const toggleCompareModal = useCallback(() => {
    setIsCompareModalOpen((prev) => !prev);
  }, []);

  const isInCompareList = useCallback(
    (bookId) => compareList.some((b) => b._id === bookId),
    [compareList]
  );

  return (
    <BookComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompareList,
        isCompareModalOpen,
        toggleCompareModal,
        setIsCompareModalOpen,
        isInCompareList,
        compareCount: compareList.length,
      }}
    >
      {children}
    </BookComparisonContext.Provider>
  );
};

export const useBookComparison = () => {
  const context = useContext(BookComparisonContext);
  if (!context) {
    throw new Error(
      "useBookComparison must be used within BookComparisonProvider"
    );
  }
  return context;
};

export default BookComparisonContext;
