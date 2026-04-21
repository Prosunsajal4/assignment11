const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 skeleton-loader" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 skeleton-loader" />
        
        {/* Author */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 skeleton-loader" />
        
        {/* Category Badge */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loader" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loader" />
        </div>
        
        {/* Price and Button */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded skeleton-loader" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loader" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonText = ({ lines = 3 }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loader"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const SkeletonHero = () => {
  return (
    <div className="h-[60vh] bg-gray-200 dark:bg-gray-800 animate-pulse skeleton-loader">
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto skeleton-loader" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto skeleton-loader" />
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-40 mx-auto mt-8 skeleton-loader" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
