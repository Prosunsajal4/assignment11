import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlay,
  FaPause,
  FaBookOpen,
  FaTruck,
  FaShieldAlt,
  FaStar,
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
    <section className="relative pt-20 lg:pt-24 h-[90vh] min-h-[650px] overflow-hidden">
      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.gradient} transition-all duration-1000`}
      />
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Text Content */}
          <div className="text-white z-10 order-2 lg:order-1">
            <div key={currentSlide} className="animate-fadeInUp">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full mb-8 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium tracking-wide">
                  Free Delivery on First Order
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {current.title}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300">
                  {current.highlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-lg leading-relaxed">
                {current.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/books"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300"
                >
                  {current.cta.primary}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-md text-white font-semibold rounded-full border border-white/25 hover:bg-white/25 hover:border-white/40 transition-all duration-300"
                >
                  <FaPlay className="text-xs" />
                  {current.cta.secondary}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold"
                    >
                      {String.fromCodePoint(0x1f60a + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-amber-400 text-sm" />
                  ))}
                  <span className="ml-2 text-sm font-medium">4.9/5 from 50K+ readers</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-sm text-white/70">Books Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-sm text-white/70">Happy Readers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="text-sm text-white/70">User Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="hidden lg:block relative order-1 lg:order-2">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  src={current.image}
                  alt="Books collection"
                  style={{ height: "min(65vh, 650px)" }}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-10 top-24 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl animate-float border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaBookOpen className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">New Arrival</p>
                    <p className="text-xs text-gray-500">The Midnight Library</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 bottom-36 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl animate-float border border-white/30" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaTruck className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Fast Delivery</p>
                    <p className="text-xs text-gray-500">2-3 Business Days</p>
                  </div>
                </div>
              </div>

              <div className="absolute left-12 -bottom-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl animate-float border border-white/30" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaShieldAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 border border-white/20 transition-all"
          aria-label="Previous slide"
        >
          ←
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-10 h-3 bg-white"
                  : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 border border-white/20 transition-all"
          aria-label="Next slide"
        >
          →
        </button>

        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 border border-white/20 transition-all ml-2"
          aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
        </button>
      </div>
    </section>
  );
};

export default Hero;
