import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlay,
  FaPause,
  FaBookOpen,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: "Discover Your Next",
      highlight: "Great Adventure",
      subtitle:
        "Explore thousands of books delivered to your doorstep. From bestsellers to hidden gems, find your perfect read today.",
      cta: { primary: "Explore Books", secondary: "Learn More" },
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      image:
        "https://images.unsplash.com/photo-1495446815901-a7297e633ad8?w=1200",
    },
    {
      title: "Books That",
      highlight: "Inspire & Transform",
      subtitle:
        "Curated collection of life-changing books. Join our community of readers and unlock exclusive deals.",
      cta: { primary: "Start Reading", secondary: "View Deals" },
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200",
    },
    {
      title: "Support Local",
      highlight: "Book Sellers",
      subtitle:
        "Connect with trusted sellers in your community. Every purchase supports local entrepreneurs.",
      cta: { primary: "Sell Books", secondary: "How It Works" },
      gradient: "from-amber-600 via-orange-600 to-red-600",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const current = slides[currentSlide];

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${current.gradient} transition-all duration-1000`}
      />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float animation-delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="text-white z-10">
            <div key={currentSlide} className="animate-fadeInUp">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  Free Delivery on First Order
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {current.title}{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300">
                  {current.highlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
                {current.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {current.cta.primary}
                  <FaArrowRight />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  {current.cta.secondary}
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-sm text-white/80">Books Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-sm text-white/80">Happy Readers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="text-sm text-white/80">User Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={current.image}
                  alt="Books"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-8 top-20 glass rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <FaBookOpen className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      New Arrival
                    </p>
                    <p className="text-sm text-gray-500">
                      The Midnight Library
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-32 glass rounded-2xl p-4 shadow-xl animate-float animation-delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <FaTruck className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Fast Delivery
                    </p>
                    <p className="text-sm text-gray-500">2-3 Business Days</p>
                  </div>
                </div>
              </div>

              <div className="absolute left-10 -bottom-4 glass rounded-2xl p-4 shadow-xl animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Secure Payment
                    </p>
                    <p className="text-sm text-gray-500">100% Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        {/* Prev/Next Buttons */}
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <span className="sr-only">Previous</span>←
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <span className="sr-only">Next</span>→
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors ml-4"
        >
          {isAutoPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>
      </div>
    </section>
  );
};

export default Hero;
