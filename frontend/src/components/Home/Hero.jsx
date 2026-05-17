import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const slides = [
  {
    id: 1,
    badge: "Free Delivery on First Order",
    title: "Discover Your Next",
    highlight: "Great Adventure",
    subtitle:
      "Explore thousands of books delivered to your doorstep. From bestsellers to hidden gems, find your perfect read today.",
    cta: { primary: "Explore Books", secondary: "Learn More" },
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633ad8?w=1200",
    floatingCards: [
      { icon: FaBookOpen, title: "New Arrival", desc: "The Midnight Library", gradient: "from-indigo-500 to-purple-600" },
      { icon: FaTruck, title: "Fast Delivery", desc: "2-3 Business Days", gradient: "from-emerald-500 to-teal-600" },
      { icon: FaShieldAlt, title: "Secure Payment", desc: "100% Protected", gradient: "from-purple-500 to-pink-600" },
    ],
  },
  {
    id: 2,
    badge: "Curated Collection",
    title: "Books That",
    highlight: "Inspire & Transform",
    subtitle:
      "Curated collection of life-changing books. Join our community of readers and unlock exclusive deals.",
    cta: { primary: "Start Reading", secondary: "View Deals" },
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200",
    floatingCards: [
      { icon: FaStar, title: "Top Rated", desc: "4.9/5 Average", gradient: "from-amber-500 to-orange-600" },
      { icon: FaBookOpen, title: "10K+ Books", desc: "All Genres", gradient: "from-blue-500 to-indigo-600" },
      { icon: FaTruck, title: "Free Shipping", desc: "Orders $25+", gradient: "from-green-500 to-emerald-600" },
    ],
  },
  {
    id: 3,
    badge: "Support Local",
    title: "Support Local",
    highlight: "Book Sellers",
    subtitle:
      "Connect with trusted sellers in your community. Every purchase supports local entrepreneurs.",
    cta: { primary: "Sell Books", secondary: "How It Works" },
    gradient: "from-amber-600 via-orange-600 to-red-600",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200",
    floatingCards: [
      { icon: FaTruck, title: "Local Delivery", desc: "Same Day", gradient: "from-red-500 to-pink-600" },
      { icon: FaShieldAlt, title: "Verified Sellers", desc: "Trusted Network", gradient: "from-cyan-500 to-blue-600" },
      { icon: FaStar, title: "Community", desc: "50K+ Members", gradient: "from-violet-500 to-purple-600" },
    ],
  },
];

const AUTOPLAY_DURATION = 6000;

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const navigateSlide = useCallback((newIndex) => {
    setDirection(newIndex > currentSlide ? 1 : -1);
    setCurrentSlide(newIndex);
    setProgress(0);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DURATION);
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, nextSlide]);

  // Progress bar
  useEffect(() => {
    if (!isAutoPlaying) {
      setProgress(0);
      return;
    }
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };
    progressRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(progressRef.current);
  }, [currentSlide, isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        setIsAutoPlaying(false);
      } else if (e.key === "ArrowRight") {
        nextSlide();
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  const imageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  const current = slides[currentSlide];

  return (
    <section className="relative pt-20 lg:pt-24 h-[90vh] min-h-[650px] overflow-hidden">
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${current.gradient}`}
        />
      </AnimatePresence>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 25, 0], x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Text Content */}
          <div className="text-white z-10 order-2 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full mb-8 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium tracking-wide">
                    {current.badge}
                  </span>
                </motion.div>

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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block relative order-1 lg:order-2">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative"
              >
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
                {current.floatingCards.map((card, i) => {
                  const positions = [
                    { top: "6rem", left: "-2.5rem", right: "auto", bottom: "auto" },
                    { top: "auto", left: "auto", right: "-1.5rem", bottom: "9rem" },
                    { top: "auto", left: "3rem", right: "auto", bottom: "-1.5rem" },
                  ];
                  const delays = [0, 0.2, 0.4];
                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 z-10"
                      style={positions[i]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: delays[i] + 0.3, duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                            <card.icon className="text-white text-xl" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{card.title}</p>
                            <p className="text-xs text-gray-500">{card.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        {/* Prev Button */}
        <button
          onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
          className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 border border-white/20 transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => { navigateSlide(i); setIsAutoPlaying(false); }}
              className="group flex items-center gap-2"
              aria-label={`Go to slide ${i + 1}`}
            >
              {/* Dot */}
              <div className="relative">
                <div
                  className={`rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "w-10 h-3 bg-white"
                      : "w-3 h-3 bg-white/40 group-hover:bg-white/70"
                  }`}
                />
                {/* Progress ring for active slide */}
                {i === currentSlide && isAutoPlaying && (
                  <div
                    className="absolute inset-0 rounded-full bg-white/30"
                    style={{
                      clipPath: `inset(0 ${100 - progress}% 0 0)`,
                    }}
                  />
                )}
              </div>
              {/* Label */}
              <span
                className={`text-xs font-medium transition-all duration-300 hidden md:block ${
                  i === currentSlide
                    ? "text-white opacity-100"
                    : "text-white/50 opacity-0 group-hover:opacity-100"
                }`}
              >
                {slide.highlight}
              </span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
          className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 border border-white/20 transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-sm" />
        </button>

        {/* Autoplay Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110 ml-1 ${
            isAutoPlaying
              ? "bg-white/20 border-white/30 text-white"
              : "bg-white/10 border-white/15 text-white/60"
          }`}
          aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress Bar at Top */}
      {isAutoPlaying && (
        <div className="absolute top-20 lg:top-24 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-white/50"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}
    </section>
  );
};

export default Hero;
