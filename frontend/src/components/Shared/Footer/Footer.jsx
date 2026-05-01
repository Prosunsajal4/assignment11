import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaBook,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// X (Twitter) logo SVG
const XIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.53 3H21.5L14.42 10.91L22.75 21H16.19L10.89 14.37L4.91 21H0.94L8.44 12.61L0.42 3H7.13L12 9.13L17.53 3ZM16.37 19.13H18.19L6.5 4.75H4.54L16.37 19.13Z"
      fill="currentColor"
    />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/books", label: "All Books" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/blog", label: "Blog" },
  ];

  const supportLinks = [
    { to: "/help", label: "Help & Support" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/my-wishlist", label: "My Wishlist" },
    { to: "/dashboard/my-orders", label: "My Orders" },
  ];

  const legalLinks = [
    { to: "/privacy-terms", label: "Privacy Policy" },
    { to: "/privacy-terms", label: "Terms of Service" },
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/SajalProsun",
      icon: FaFacebook,
      label: "Facebook",
      hoverColor: "hover:text-blue-500",
    },
    {
      href: "https://www.instagram.com/prosun_mukherjee_sajal/",
      icon: FaInstagram,
      label: "Instagram",
      hoverColor: "hover:text-pink-500",
    },
    {
      href: "https://www.linkedin.com/in/prosun-mukherjee-sajal",
      icon: FaLinkedin,
      label: "LinkedIn",
      hoverColor: "hover:text-blue-600",
    },
    {
      href: "https://github.com/Prosunsajal4",
      icon: FaGithub,
      label: "GitHub",
      hoverColor: "hover:text-gray-400",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white font-['Manrope']">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_45%)]" />
      </div>

      {/* Discovery Callout */}
      <div className="relative max-w-7xl mx-auto px-4 pt-12">
        <div className="glass-dark rounded-3xl px-6 py-8 md:px-10 md:py-10 border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-indigo-300">
                Curated routes
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-['Fraunces'] font-semibold text-white">
                Find your next reading path in minutes.
              </h2>
              <p className="mt-3 text-gray-300 max-w-2xl">
                Mix librarian picks, indie gems, and delivery alerts into one
                smooth shelf.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/books"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-indigo-400 hover:to-pink-400 transition-colors"
              >
                Explore catalog
              </Link>
              <Link
                to="/dashboard/my-wishlist"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 hover:border-white/50 hover:text-white transition-colors"
              >
                Save a wishlist
              </Link>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <p className="text-white font-semibold">Reader-first delivery</p>
              <p className="text-gray-300 mt-2">
                Smart routing for same-week arrivals.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <p className="text-white font-semibold">Live inventory sync</p>
              <p className="text-gray-300 mt-2">
                Know what is ready to ship today.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <p className="text-white font-semibold">Community favorites</p>
              <p className="text-gray-300 mt-2">
                Ratings that surface hidden gems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBook className="text-2xl text-white" />
              </div>
              <span className="font-['Fraunces'] font-semibold text-2xl">
                Book<span className="text-indigo-300">Courier</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted library-to-home delivery system. Connecting book
              lovers with their next favorite read since 2024.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${social.hoverColor} hover:bg-white/10 border border-white/10`}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-300 hover:text-gray-300 hover:bg-white/10 border border-white/10"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer Quick Links">
            <div>
              <h3 className="font-['Fraunces'] font-semibold text-lg mb-6 text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Support Links */}
          <nav aria-label="Footer Support Links">
            <div>
              <h3 className="font-['Fraunces'] font-semibold text-lg mb-6 text-white">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Footer Legal Links">
            <div>
              <h3 className="font-['Fraunces'] font-semibold text-lg mb-6 text-white">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Contact Info */}
          <div>
            <div className="mb-10">
              <h3 className="font-['Fraunces'] font-semibold text-lg mb-4 text-white">
                Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get monthly reading picks, author spotlights, and delivery
                deals.
              </p>
              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="sr-only" htmlFor="footer-newsletter-email">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white hover:from-indigo-400 hover:to-pink-400 transition-colors"
                >
                  Join the list
                </button>
              </form>
            </div>

            <h3 className="font-['Fraunces'] font-semibold text-lg mb-6 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                  <span className="text-lg">&#x1F4CD;</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Khulna, Bangladesh</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                  <span className="text-lg">&#x1F4E7;</span>
                </div>
                <a
                  href="mailto:prosunsajal123@gmail.com"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  prosunsajal123@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                  <span className="text-lg">&#x1F4DE;</span>
                </div>
                <a
                  href="tel:+8801911572117"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  +8801911572117
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} BookCourier. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <FaHeart className="text-pink-400" /> for book lovers
              everywhere
            </p>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
