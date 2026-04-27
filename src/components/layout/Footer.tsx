import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-deep-black text-off-white overflow-hidden border-t-8 border-orange">
      {/* Brutalist Marquee Banner */}
      <div className="bg-orange text-deep-black py-4 border-b-8 border-deep-black flex overflow-hidden w-full relative z-20">
        <div className="animate-marquee whitespace-nowrap flex font-heading font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-widest items-center">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center mx-4">
              <span>AVAILABLE FOR FREELANCE</span>
              <span className="text-deep-black/60 mx-4">★</span>
              <span>LET'S CREATE MAGIC</span>
              <span className="text-deep-black/60 mx-4">★</span>
            </span>
          ))}
        </div>
      </div>

      <div className="section-dark pb-12 sm:pb-16 md:pb-24 pt-16 sm:pt-20 md:pt-24 relative z-10 w-full">
        {/* Giant background text */}
        <div 
          className="absolute opacity-[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[15vw] sm:text-[20vw] whitespace-nowrap pointer-events-none select-none z-0"
        >
          EDITXSUBH
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            
            {/* Massive Brand statement */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-block tape mb-6 bg-yellow-highlight text-deep-black px-4 py-1 font-bold text-sm transform -rotate-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                YOUR NEXT EDITOR
              </div>
              
              <Link to="/" className="font-display text-6xl sm:text-7xl md:text-8xl text-off-white tracking-wide hover:text-orange transition-colors inline-block pb-2">
                edit<span className="text-orange">x</span>subh
              </Link>
              
              <p className="mt-4 text-mid-gray font-body text-lg max-w-md leading-relaxed border-l-4 border-orange pl-4 bg-deep-black/50 py-2">
                Helping creators and brands turn raw ideas into cinematic, eye-catching visual experiences that demand attention.
              </p>
              
              {/* Brutalist Social Buttons */}
              <div className="flex flex-wrap gap-5 mt-8 sm:mt-10">
                {[
                  { icon: Instagram, href: "https://www.instagram.com/editwithshub/" },
                  { icon: Twitter, href: "https://x.com/editxshub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/editxsubh/" },
                  { icon: Mail, href: "mailto:shubhams6068@gmail.com" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-14 h-14 flex items-center justify-center bg-deep-black border-2 border-orange text-orange transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1"
                    aria-label="Social Link"
                  >
                    <span className="absolute inset-0 w-full h-full bg-orange scale-0 group-hover:scale-100 transition-transform origin-bottom-left ease-out duration-300 z-0"></span>
                    <social.icon className="w-6 h-6 relative z-10 group-hover:text-deep-black transition-colors" />
                    {/* Hard shadow */}
                    <span className="absolute top-1 left-1 w-full h-full bg-orange -z-10 group-hover:top-2 group-hover:left-2 transition-all"></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation & Contact */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8 lg:pl-12 pt-4">
              {/* Navigation */}
              <div className="flex flex-col">
                <h4 className="font-heading font-black text-2xl text-off-white mb-6 uppercase tracking-wider relative inline-block w-fit">
                  Site Map
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-orange"></span>
                </h4>
                <nav className="flex flex-col gap-4">
                  {["Portfolio", "About", "Resources", "Shop", "Blog", "Contact"].map((item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase()}`}
                      className="group flex justify-between items-center w-full max-w-[220px] text-mid-gray hover:text-off-white font-heading text-xl uppercase transition-colors"
                    >
                      <span className="group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-orange" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Contact */}
              <div className="flex flex-col">
                <h4 className="font-heading font-black text-2xl text-off-white mb-6 uppercase tracking-wider relative inline-block w-fit">
                  IntelHQ
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brutal-blue"></span>
                </h4>
                <div className="flex flex-col gap-6 font-body">
                  <div className="p-5 bg-near-black border-l-4 border-brutal-teal relative group overflow-hidden">
                    <div className="absolute inset-0 bg-brutal-teal/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                    <p className="text-sm text-mid-gray mb-1 uppercase font-bold tracking-wider relative z-10">Email</p>
                    <a href="mailto:shubhams6068@gmail.com" className="text-off-white hover:text-orange transition-colors break-all font-bold text-[17px] relative z-10">
                      shubhams6068@gmail.com
                    </a>
                  </div>
                  
                  <div className="p-5 bg-near-black border-l-4 border-brutal-yellow relative group overflow-hidden">
                    <div className="absolute inset-0 bg-brutal-yellow/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                    <p className="text-sm text-mid-gray mb-1 uppercase font-bold tracking-wider relative z-10">Base</p>
                    <p className="text-off-white font-bold text-[17px] relative z-10">Greater Jaipur Area,<br />India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brutalist Divider */}
          <div className="mt-16 sm:mt-24 mb-8 h-[2px] w-full bg-grid-line/20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-deep-black px-4 text-orange text-xl">
              ★
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 font-body text-sm pt-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange"></span>
              </div>
              <p className="text-mid-gray uppercase tracking-wider font-bold">
                SYSTEM ONLINE © {currentYear}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-mid-gray font-bold uppercase tracking-wider text-xs">
              <Link to="/privacy-policy" className="hover:text-off-white hover:underline underline-offset-4 decoration-orange decoration-2 transition-all">Privacy</Link>
              <span className="text-dark-gray hidden md:inline">•</span>
              <Link to="/terms" className="hover:text-off-white hover:underline underline-offset-4 decoration-orange decoration-2 transition-all">Terms</Link>
              <span className="text-dark-gray hidden md:inline">•</span>
              <Link to="/refund-policy" className="hover:text-off-white hover:underline underline-offset-4 decoration-orange decoration-2 transition-all">Refunds</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
