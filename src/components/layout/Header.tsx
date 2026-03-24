import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "About", path: "/about" },
  { label: "Resources", path: "/resources" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-deep-black/80 backdrop-blur-xl shadow-lg shadow-deep-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-2xl md:text-3xl text-orange tracking-wider">
              editxsubh
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-body font-medium transition-colors duration-200 hover:text-orange ${
                    location.pathname === link.path ? "text-orange" : "text-off-white"
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange"
                    />
                  )}
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/my-library"
                  className={`relative text-sm font-body font-bold transition-colors duration-200 hover:text-orange ${
                    location.pathname === "/my-library" ? "text-orange" : "text-off-white"
                  }`}
                >
                  {location.pathname === "/my-library" && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange"
                    />
                  )}
                  My Library
                </Link>
              )}
            </nav>

            {/* Hire Me CTA */}
            <Link
              to="/contact"
              className="hidden lg:inline-flex px-6 py-2.5 bg-orange text-primary-foreground font-heading font-semibold text-sm rounded-full hover:bg-orange-dark hover:scale-[1.04] transition-all duration-250"
            >
              Hire Me
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-off-white p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-deep-black flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    className={`font-display text-4xl md:text-5xl tracking-wider transition-colors ${
                      location.pathname === link.path ? "text-orange" : "text-off-white hover:text-orange"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
                >
                  <Link
                    to="/my-library"
                    className={`font-display text-4xl md:text-5xl tracking-wider transition-colors ${
                      location.pathname === "/my-library" ? "text-orange" : "text-off-white hover:text-orange"
                    }`}
                  >
                    My Library
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + (user ? 1 : 0)) * 0.08, duration: 0.4 }}
              >
                <Link
                  to="/contact"
                  className="mt-4 px-8 py-3 bg-orange text-primary-foreground font-heading font-semibold text-lg rounded-full"
                >
                  Hire Me
                </Link>
              </motion.div>
            </nav>

            {/* Social links in mobile menu */}
            <div className="absolute bottom-12 flex gap-6">
              <a href="https://instagram.com/editxshubh" target="_blank" rel="noopener noreferrer" className="text-mid-gray hover:text-orange transition-colors text-sm font-body">Instagram</a>
              <a href="https://twitter.com/editxsubh" target="_blank" rel="noopener noreferrer" className="text-mid-gray hover:text-orange transition-colors text-sm font-body">Twitter</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
