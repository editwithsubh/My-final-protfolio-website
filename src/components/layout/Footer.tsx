import { Link } from "react-router-dom";
import { Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="section-dark py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-3xl text-orange tracking-wider">
              editxsubh
            </Link>
            <p className="mt-4 text-mid-gray font-body text-sm max-w-xs leading-relaxed">
              Helping creators and brands turn ideas into cinematic content.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/editxshubh"
                target="_blank"
                rel="noopener"
                className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange hover:bg-orange hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com/editxsubh"
                target="_blank"
                rel="noopener"
                className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange hover:bg-orange hover:text-primary-foreground transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-bold text-off-white mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {["Portfolio", "About", "Resources", "Shop", "Blog", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-mid-gray hover:text-orange transition-colors text-sm font-body"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-off-white mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-3 text-sm font-body">
              <a href="mailto:hello@editxsubh.com" className="text-orange hover:text-orange-light transition-colors">
                hello@editxsubh.com
              </a>
              <p className="text-mid-gray">Greater Jaipur Area, India</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-dark-gray flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mid-gray text-xs font-body">
            © 2026 Shubham Sharma — editxsubh.com
          </p>
          <div className="flex gap-6 text-xs font-body text-mid-gray">
            <Link to="/privacy-policy" className="hover:text-orange transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-orange transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-orange transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
