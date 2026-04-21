import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import BookCourierSpinner from "../../components/Shared/BookCourierSpinner";
import Hero from "../../components/Home/Hero";


const LatestBooks = lazy(() => import("../../components/Home/LatestBooks"));
const CoverageMap = lazy(() => import("../../components/Home/CoverageMap"));
const WhyChooseBookCourier = lazy(
  () => import("../../components/Home/WhyChooseBookCourier"),
);
const ExtraSectionOne = lazy(
  () => import("../../components/Home/ExtraSectionOne"),
);
const ExtraSectionTwo = lazy(
  () => import("../../components/Home/ExtraSectionTwo"),
);
const Testimonials = lazy(() => import("../../components/Home/Testimonials"));
const FAQ = lazy(() => import("../../components/Home/FAQ"));
const StatisticsCounter = lazy(
  () => import("../../components/Home/StatisticsCounter"),
);
const Newsletter = lazy(() => import("../../components/Home/Newsletter"));
const FeaturedAuthors = lazy(
  () => import("../../components/Home/FeaturedAuthors"),
);
const Categories = lazy(() => import("../../components/Home/Categories"));
const RecentlyViewedBooks = lazy(
  () => import("../../components/Home/RecentlyViewedBooks"),
);

// Modern: Loading component for Suspense fallback
const ComponentLoader = ({ componentName }) => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <BookCourierSpinner />
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Loading {componentName}...
      </p>
    </div>
  </div>
);

// Section wrapper with animation - simplified for smoothness
const AnimatedSection = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero Section - Full Screen */}
      <Hero />

      {/* 2. Browse by Category - Quick Access */}
      <AnimatedSection className="py-20 bg-white dark:bg-gray-900">
        <Suspense fallback={<ComponentLoader componentName="Categories" />}>
          <Categories />
        </Suspense>
      </AnimatedSection>

      {/* 3. Latest Books - Featured Collection */}
      <AnimatedSection className="py-20 bg-gray-50 dark:bg-gray-800">
        <Suspense fallback={<ComponentLoader componentName="Latest Books" />}>
          <LatestBooks />
        </Suspense>
      </AnimatedSection>

      {/* 4. Personal Recommendations removed (AI feature) */}

      {/* 5. Recently Viewed - User History */}
      <AnimatedSection className="py-16 bg-white dark:bg-gray-900">
        <Suspense
          fallback={<ComponentLoader componentName="Recently Viewed" />}
        >
          <RecentlyViewedBooks />
        </Suspense>
      </AnimatedSection>

      {/* 6. Statistics Counter - Trust Indicators */}
      <AnimatedSection className="py-20 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600">
        <Suspense fallback={<ComponentLoader componentName="Statistics" />}>
          <StatisticsCounter />
        </Suspense>
      </AnimatedSection>

      {/* 7. Why Choose BookCourier - Value Proposition */}
      <AnimatedSection className="py-20 bg-white dark:bg-gray-900">
        <Suspense fallback={<ComponentLoader componentName="Why Choose Us" />}>
          <WhyChooseBookCourier />
        </Suspense>
      </AnimatedSection>

      {/* 8. Featured Authors - Community Highlight */}
      <AnimatedSection className="py-20 bg-gray-50 dark:bg-gray-800">
        <Suspense
          fallback={<ComponentLoader componentName="Featured Authors" />}
        >
          <FeaturedAuthors />
        </Suspense>
      </AnimatedSection>

      {/* 9. Testimonials - Social Proof */}
      <AnimatedSection className="py-20 bg-white dark:bg-gray-900">
        <Suspense fallback={<ComponentLoader componentName="Testimonials" />}>
          <Testimonials />
        </Suspense>
      </AnimatedSection>

      {/* 10. Coverage Map - Service Area */}
      <AnimatedSection className="py-20 bg-gray-50 dark:bg-gray-800">
        <Suspense fallback={<ComponentLoader componentName="Coverage Map" />}>
          <CoverageMap />
        </Suspense>
      </AnimatedSection>

      {/* 11. FAQ - Common Questions */}
      <AnimatedSection className="py-20 bg-white dark:bg-gray-900">
        <Suspense fallback={<ComponentLoader componentName="FAQ" />}>
          <FAQ />
        </Suspense>
      </AnimatedSection>

      {/* 12. Newsletter - CTA Section */}
      <AnimatedSection className="py-20 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <Suspense fallback={<ComponentLoader componentName="Newsletter" />}>
          <Newsletter />
        </Suspense>
      </AnimatedSection>
    </div>
  );
};

export default Home;
