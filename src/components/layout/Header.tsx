import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Library, Menu, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "About", path: "/about" },
  { label: "Vault", path: "/resources" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
          scrolled
            ? "bg-deep-black/90 backdrop-blur-xl shadow-lg shadow-deep-black/20 border-b-2 border-brutal-yellow/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 lg:px-[120px]">
          <div className="relative flex items-center justify-between h-14 md:h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-xl md:text-3xl text-orange tracking-wider z-10 shrink-0">
              editxsubh
            </Link>

            {/* Desktop Nav — centered in header */}
            <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
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
            </nav>

            <div className="hidden lg:flex items-center gap-4 shrink-0 z-10">
              <Link
                to={user ? "/my-library" : "/login"}
                className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-orange text-orange font-heading font-semibold text-sm rounded-full transition-all duration-250 hover:bg-orange hover:text-primary-foreground"
              >
                {user ? <Library size={16} /> : <User size={16} />}
                {user ? 'My Library' : 'Login'}
              </Link>

              <Link
                to="/contact"
                className="inline-flex px-6 py-2.5 bg-orange text-primary-foreground font-heading font-semibold text-sm rounded-full hover:bg-orange-dark hover:scale-[1.04] transition-all duration-250"
              >
                Hire Me
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-off-white w-11 h-11 flex items-center justify-center -mr-2 z-10 touch-manipulation"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
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
            className="fixed inset-0 z-50 bg-deep-black flex flex-col items-center justify-center px-6"
          >
            <nav className="flex flex-col items-center gap-8 w-full max-w-sm">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="w-full text-center"
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-4xl md:text-5xl tracking-wider transition-colors py-2 block ${
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
                  className="w-full text-center"
                >
                  <Link
                    to="/my-library"
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-4xl md:text-5xl tracking-wider transition-colors py-2 block ${
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
                className="w-full text-center"
              >
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className={`inline-flex items-center gap-3 font-display text-3xl md:text-4xl tracking-wider transition-colors ${
                      location.pathname === "/login" ? "text-orange" : "text-off-white hover:text-orange"
                    }`}
                  >
                    <Library size={28} /> Login
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1 + (user ? 1 : 0)) * 0.08, duration: 0.4 }}
                className="pt-4"
              >
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-block px-10 py-4 bg-orange text-deep-black font-heading font-bold text-lg rounded-lg hover:bg-brutal-yellow transition-colors"
                >
                  Hire Me
                </Link>
              </motion.div>
            </nav>

            {/* Social links in mobile menu */}
            <div className="absolute bottom-10 flex flex-wrap justify-center gap-6 px-4">
              <a href="https://www.instagram.com/editwithshub/" target="_blank" rel="noopener noreferrer" className="text-mid-gray hover:text-orange transition-colors text-sm font-body">Instagram</a>
              <a href="https://x.com/editxshub" target="_blank" rel="noopener noreferrer" className="text-mid-gray hover:text-orange transition-colors text-sm font-body">X</a>
              <a href="https://www.linkedin.com/in/editxsubh/" target="_blank" rel="noopener noreferrer" className="text-mid-gray hover:text-orange transition-colors text-sm font-body">LinkedIn</a>
              <a href="mailto:shubhams6068@gmail.com" className="text-mid-gray hover:text-orange transition-colors text-sm font-body">Email</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
