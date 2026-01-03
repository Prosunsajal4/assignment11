import LatestBooks from "../../components/Home/LatestBooks";
import Slider from "../../components/Shared/Slider/Slider";
import CoverageMap from "../../components/Home/CoverageMap";
import WhyChooseBookCourier from "../../components/Home/WhyChooseBookCourier";
import ExtraSectionOne from "../../components/Home/ExtraSectionOne";
import ExtraSectionTwo from "../../components/Home/ExtraSectionTwo";
import Testimonials from "../../components/Home/Testimonials";
import FAQ from "../../components/Home/FAQ";
import StatisticsCounter from "../../components/Home/StatisticsCounter";
import Newsletter from "../../components/Home/Newsletter";
import FeaturedAuthors from "../../components/Home/FeaturedAuthors";
import Categories from "../../components/Home/Categories";

const Home = () => {
  const heroSlides = [
    {
      bg: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600",
      title: "Discover Your Next Favorite Book",
      subtitle:
        "Curated picks, fast delivery, and exclusive deals for readers.",
      cta: { href: "/books", label: "Explore Collections" },
    },
    {
      bg: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600",
      title: "Fresh Reads, Delivered Quickly",
      subtitle: "From bestsellers to hidden gems—add to wishlist instantly.",
      cta: { href: "/dashboard/my-wishlist", label: "View Wishlist" },
    },
    {
      bg: "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600",
      title: "Support Local Sellers",
      subtitle: "Great books from trusted sellers in your community.",
      cta: { href: "/dashboard/seller/add-book", label: "Sell a Book" },
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Slider - 60-70% viewport height */}
      <div className="h-[60vh] md:h-[70vh]">
        <Slider slides={heroSlides} interval={5000} />
      </div>

      {/* 1. Latest Books */}
      <section className="py-16">
        <LatestBooks />
      </section>

      {/* 2. Browse by Category */}
      <Categories />

      {/* 3. Statistics Counter */}
      <StatisticsCounter />

      {/* 4. Why Choose BookCourier */}
      <section className="py-16">
        <WhyChooseBookCourier />
      </section>

      {/* 5. Featured Authors */}
      <FeaturedAuthors />

      {/* 6. Coverage Map */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <CoverageMap />
      </section>

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. Extra Section One (Reading Tips) */}
      <section className="py-16">
        <ExtraSectionOne />
      </section>

      {/* 9. FAQ */}
      <FAQ />

      {/* 10. Extra Section Two (Best Sellers) */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <ExtraSectionTwo />
      </section>

      {/* 11. Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
