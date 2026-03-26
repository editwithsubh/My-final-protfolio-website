import { Link } from "react-router-dom";
import { Play, ArrowRight, Instagram, Twitter, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import Marquee from "@/components/layout/Marquee";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

/* ─── HERO SECTION ─── */
const HeroSection = () => (
  <section className="section-light min-h-screen flex items-center pt-20 relative overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] w-full py-12 md:py-0">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
        {/* Left content — 60% */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="font-handwritten text-xl md:text-2xl text-orange">Hi, I'm</p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[96px] leading-[0.9] tracking-wider text-deep-black">
            SHUBHAM{" "}
            <span className="highlight-word">SHARMA</span>
          </h1>
          <div className="space-y-2">
            <p className="font-heading font-bold text-xl md:text-2xl text-deep-black/80">
              Video Editor & Motion Graphics Specialist
            </p>
            <p className="font-body text-base md:text-lg text-mid-gray max-w-lg leading-relaxed">
              Helping creators and brands turn ideas into cinematic content.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-3 bg-orange text-primary-foreground font-heading font-semibold text-sm rounded-full hover:bg-orange-dark hover:scale-[1.04] transition-all duration-250"
            >
              View Portfolio <ArrowRight size={16} />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-orange text-orange font-heading font-semibold text-sm rounded-full hover:bg-orange hover:text-primary-foreground transition-all duration-250"
            >
              Explore Resources
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-deep-black text-deep-black font-heading font-semibold text-sm rounded-full hover:bg-deep-black hover:text-off-white transition-all duration-250"
            >
              Hire Me
            </Link>
          </div>

          {/* Social links */}
          <div className="flex gap-3 pt-4">
            {[
              { icon: Instagram, href: "https://instagram.com/editxshubh", label: "Instagram" },
              { icon: Twitter, href: "https://twitter.com/editxsubh", label: "Twitter" },
              { icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                className="w-11 h-11 rounded-full bg-deep-black flex items-center justify-center text-off-white hover:bg-orange transition-all duration-300"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — Showreel blob */}
        <motion.div
          className="lg:col-span-2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            {/* Blob background */}
            <div className="absolute inset-0 bg-orange rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-blob opacity-90" />
            {/* Inner content */}
            <div className="absolute inset-4 bg-near-black rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform cursor-pointer">
                  <Play size={24} fill="white" className="text-primary-foreground ml-1" />
                </div>
                <p className="font-handwritten text-off-white text-lg">Watch Showreel</p>
              </div>
            </div>
            {/* Masking tape decorations */}
            <div className="absolute -top-3 -right-3 w-20 h-7 bg-off-white/70 rotate-[5deg] shadow-sm" />
            <div className="absolute -bottom-3 -left-3 w-20 h-7 bg-yellow-highlight/50 -rotate-[3deg] shadow-sm" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── MINI ABOUT SECTION (Redesigned matching reference) ─── */
const AboutSnippet = () => (
  <section className="bg-[#EAEAEA] py-16 md:py-20 relative overflow-hidden">
    {/* Right Edge Vertical Label */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 transform rotate-90 origin-right text-xs font-mono tracking-[0.2em] text-deep-black/60 hidden lg:block">
      SHUBHAM © 2025
    </div>

    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
      {/* Top Header line */}
      <div className="flex items-center gap-4 mb-12 md:mb-16">
        <h2 className="font-heading font-black text-lg md:text-xl text-deep-black uppercase tracking-wide">
          About
        </h2>
        <div className="flex-1 h-[2px] bg-deep-black"></div>
        <div className="w-10 h-10 rounded-full border-2 border-deep-black flex items-center justify-center shrink-0 hover:bg-deep-black hover:text-white transition-colors cursor-default">
          <ArrowRight size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Side: Photo & Blob */}
        <ScrollReveal direction="left" className="relative group mx-auto lg:mx-0 max-w-sm w-full">
          {/* Yellow Shape Background */}
          <div className="absolute bottom-0 left-0 w-full h-[65%] bg-[#F3C623] rounded-3xl rounded-tl-none -z-10 transition-transform duration-500 group-hover:scale-[1.02]"></div>
          
          {/* Main Photo Placeholder (Using gradient/noise for now, or you can replace with real image) */}
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-b-3xl">
            {/* The actual image goes here. Grayscale filter to match reference aesthetic */}
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
              alt="Shubham" 
              className="w-full h-full object-cover object-bottom grayscale scale-[1.02] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </ScrollReveal>

        {/* Right Side: Text & Content */}
        <ScrollReveal direction="right" className="space-y-6">
          {/* "HELLO." Heading with quotes */}
          <div className="relative inline-block mb-1">
            <span className="absolute -top-3 -left-6 font-display text-[#F3C623] text-5xl leading-none">
              "
            </span>
            <h3 className="font-heading font-black text-4xl md:text-5xl text-deep-black tracking-widest uppercase transform -rotate-3 leading-none">
              HELLO.
            </h3>
          </div>

          <div className="space-y-4 font-body text-deep-black/80 text-sm md:text-[15px] leading-relaxed">
            <p>
              I'm <strong className="text-deep-black font-bold">Shubham Sharma</strong>, a self-taught video editor & motion graphics specialist with over 3 years of experience. I love creating visuals that don't just look good - they tell a story. From social media content to high-end commercials, I enjoy bringing ideas to life.
            </p>
            <p>
              I also explore different editing styles and visual effects to add more depth to my work. For me, editing is all about connecting ideas with people in a creative, retention-driven way.
            </p>
          </div>

          {/* Software Skills Section */}
          <div className="pt-2">
            <div className="inline-block relative mb-4">
              <h4 className="font-heading font-bold text-lg text-deep-black tracking-wide">
                Software Skill
              </h4>
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#F3C623]" />
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-w-sm">
              {[
                { name: "Pr", color: "bg-[#00005C]", text: "text-[#E88AFF]" }, // Premiere
                { name: "Ai", color: "bg-[#330000]", text: "text-[#FF9A00]" }, // Illustrator
                { name: "Ps", color: "bg-[#001D34]", text: "text-[#31A8FF]" }, // Photoshop
                { name: "Lr", color: "bg-[#000000]", text: "text-[#31A8FF]" }, // Lightroom
                { name: "Ca", color: "bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5]", text: "text-white text-xs", icon: "Canva" }, 
                { name: "Cp", color: "bg-black", text: "text-white text-xs", icon: "CapCut" }, 
                { name: "Vs", color: "bg-[#0066B8]", text: "text-white" }, // VS Code
                { name: "Fg", color: "bg-[#2C2D33]", text: "text-white text-xs", icon: "Figma" }, 
              ].map((skill, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-lg ${skill.color} ${skill.text} flex flex-col items-center justify-center font-bold text-sm md:text-base shadow-sm hover:-translate-y-1 transition-transform cursor-help`}
                  title={skill.name}
                >
                  {skill.icon ? <span className="text-[10px] md:text-xs px-1">{skill.icon}</span> : skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* Visit About Link */}
          <div className="pt-6">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F3C623] text-deep-black font-heading font-black text-xs md:text-sm uppercase tracking-widest rounded-full hover:bg-deep-black hover:text-[#F3C623] transition-all duration-300 shadow-[0_4px_14px_rgba(243,198,35,0.4)]"
            >
              Visit About <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

/* ─── PORTFOLIO PREVIEW ─── */
const portfolioProjects = [
  { title: "Brand Story — Luxury Fashion", category: "YouTube", color: "bg-orange" },
  { title: "Product Launch — Tech Startup", category: "Ads", color: "bg-orange-dark" },
  { title: "Music Video — Indie Artist", category: "Motion Graphics", color: "bg-orange" },
  { title: "Travel Vlog — Creator Series", category: "YouTube", color: "bg-orange-light" },
  { title: "Social Campaign — D2C Brand", category: "Social Media", color: "bg-orange" },
  { title: "Motion Reel — 2025 Highlights", category: "Motion Graphics", color: "bg-orange-dark" },
];

const PortfolioPreview = () => (
  <section className="section-dark py-24 md:py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
      <ScrollReveal>
        <div className="text-center mb-16 section-heading-ghost" data-ghost="PORTFOLIO">
          <p className="font-handwritten text-lg text-orange mb-2">selected work</p>
          <h2 className="font-display text-5xl md:text-7xl text-off-white tracking-wider">MY WORK</h2>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
        {portfolioProjects.map((project, i) => (
          <StaggerItem key={i}>
            <Link to="/portfolio" className="group block">
              <div className="relative aspect-video bg-near-black rounded-xl overflow-hidden border border-dark-gray">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-black/80" />
                {/* Placeholder grid pattern */}
                <div className="absolute inset-0 opacity-10 grid-paper" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={40} className="text-off-white/30 group-hover:text-orange group-hover:scale-110 transition-all duration-300" />
                </div>
                {/* Category tag */}
                <span className="absolute top-3 left-3 px-3 py-1 bg-orange text-primary-foreground text-xs font-mono uppercase rounded">
                  {project.category}
                </span>
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-heading font-bold text-off-white text-sm group-hover:text-orange transition-colors">
                    {project.title}
                  </p>
                </div>
                {/* Orange bottom border on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal className="text-center mt-12">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-orange font-heading font-semibold hover:gap-4 transition-all duration-300"
        >
          View Full Portfolio <ArrowRight size={18} />
        </Link>
      </ScrollReveal>
    </div>
  </section>
);

/* ─── SERVICES ─── */
const services = [
  {
    icon: "🎬",
    title: "YouTube Video Editing",
    description: "Cinematic edits with storytelling-driven pacing, transitions, and sound design.",
    tools: ["Premiere Pro", "After Effects"],
  },
  {
    icon: "📱",
    title: "Short-Form Content",
    description: "Scroll-stopping reels, shorts, and TikToks with trending formats and hooks.",
    tools: ["After Effects", "Premiere Pro"],
  },  {
    icon: "✨",
    title: "Motion Graphics",
    description: "Custom animated logos, intros, lower thirds, and visual effects.",
    tools: ["After Effects", "Premiere Pro"],
  },
  {
    icon: "🎨",
    title: "Color Grading",
    description: "Professional color correction and cinematic looks for any footage.",
    tools: ["DaVinci Resolve", "Premiere Pro"],
  },
  {
    icon: "📺",
    title: "Ads & Commercials",
    description: "High-converting video ads for D2C brands and social campaigns.",
    tools: ["Premiere Pro", "After Effects", "Canva"],
  },
];

const ServicesSection = () => (
  <section className="section-light py-24 md:py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="font-handwritten text-lg text-orange mb-2">what I do</p>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-deep-black">Services</h2>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
        {services.map((service, i) => (
          <StaggerItem key={i}>
            <div className="bg-near-black rounded-xl p-8 border-l-[3px] border-orange hover:border-l-[6px] transition-all duration-300 group h-full">
              <span className="text-3xl mb-4 block">{service.icon}</span>
              <h3 className="font-heading font-bold text-lg text-off-white mb-2 group-hover:text-orange transition-colors">
                {service.title}
              </h3>
              <p className="font-body text-sm text-mid-gray leading-relaxed mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tools.map((tool) => (
                  <span key={tool} className="px-2 py-1 bg-dark-gray text-mid-gray text-xs font-mono rounded">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

/* ─── TOOLS ─── */
const tools = [
  { name: "Adobe Premiere Pro", level: 95 },
  { name: "After Effects", level: 90 },
  { name: "DaVinci Resolve", level: 88 },
  { name: "Canva", level: 85 },
  { name: "Filmora", level: 82 },
];

const ToolsSection = () => (
  <section className="section-dark py-24 md:py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="font-handwritten text-lg text-orange mb-2">my toolkit</p>
          <h2 className="font-display text-5xl md:text-6xl text-off-white tracking-wider">TOOLS I USE</h2>
        </div>
      </ScrollReveal>

      <div className="max-w-2xl mx-auto space-y-6">
        {tools.map((tool, i) => (
          <ScrollReveal key={tool.name} delay={i * 0.1}>
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="font-heading font-semibold text-off-white text-sm">{tool.name}</span>
                <span className="font-mono text-xs text-orange opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.level}%
                </span>
              </div>
              <div className="h-2 bg-dark-gray rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-dark to-orange rounded-full animate-fill"
                  style={{ width: `${tool.level}%` }}
                />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ─── RESOURCES PREVIEW ─── */
const resources = [
  { title: "Free LUTs Pack for Cinematic Edits", category: "Free Assets", type: "Download" },
  { title: "YouTube Editing Workflow Guide", category: "Editing Guides", type: "Guide" },
  { title: "Top 10 AI Tools for Video Editors", category: "AI Tools", type: "Article" },
  { title: "After Effects Templates Collection", category: "Free Assets", type: "Download" },
];

const ResourcesPreview = () => (
  <section className="section-light py-24 md:py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="font-handwritten text-lg text-orange mb-2">free stuff</p>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-deep-black">Resources</h2>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource, i) => (
          <StaggerItem key={i}>
            <Link to="/resources" className="group block">
              <div className="grid-paper rounded-xl p-6 border border-light-gray hover:border-orange transition-all duration-300 h-full">
                <span className="font-handwritten text-sm text-orange">{resource.category}</span>
                <h3 className="font-heading font-bold text-base text-deep-black mt-2 mb-3 group-hover:text-orange transition-colors">
                  {resource.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-mid-gray">
                  {resource.type} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

/* ─── PRODUCTS PREVIEW ─── */
const products = [
  { title: "Cinematic LUT Bundle", price: "₹499", tag: "Best Seller" },
  { title: "Premiere Pro Transitions Pack", price: "₹799", tag: "New" },
  { title: "YouTube Intro Templates", price: "₹299", tag: "" },
  { title: "Social Media Editor Toolkit", price: "₹999", tag: "Popular" },
];

const ProductsPreview = () => (
  <section className="section-dark py-24 md:py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="font-handwritten text-lg text-orange mb-2">shop</p>
          <h2 className="font-display text-5xl md:text-6xl text-off-white tracking-wider">
            GRAB THESE <span className="text-orange">→</span>
          </h2>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <StaggerItem key={i}>
            <Link to="/shop" className="group block">
              <div className="bg-near-black rounded-xl overflow-hidden border border-dark-gray hover:-translate-y-2 hover:shadow-xl hover:shadow-orange/10 transition-all duration-300">
                {/* Preview placeholder */}
                <div className="aspect-[4/3] bg-dark-gray relative overflow-hidden">
                  <div className="absolute inset-0 grid-paper opacity-20" />
                  {product.tag && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-orange text-primary-foreground text-xs font-mono uppercase rounded-full">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-sm text-off-white group-hover:text-orange transition-colors">
                    {product.title}
                  </h3>
                  <p className="font-display text-2xl text-orange mt-2">{product.price}</p>
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

/* ─── FINAL CTA ─── */
const FinalCTA = () => (
  <section className="bg-orange py-24 md:py-32 relative overflow-hidden">
    {/* Noise overlay */}
    <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] text-center relative z-10">
      <ScrollReveal>
        <h2 className="font-display text-4xl sm:text-5xl md:text-7xl text-primary-foreground tracking-wider mb-6">
          READY TO CREATE<br />BETTER VIDEOS?
        </h2>
        <p className="font-body text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
          Let's work together and turn your vision into cinematic reality.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-deep-black font-heading font-bold text-base rounded-full hover:scale-[1.04] transition-transform duration-250"
        >
          Let's Talk <ArrowRight size={18} />
        </Link>
      </ScrollReveal>
    </div>
  </section>
);

/* ─── HOME PAGE ─── */
const Index = () => {
  return (
    <>
      <HeroSection />
      <Marquee />
      <AboutSnippet />
      <PortfolioPreview />
      <ServicesSection />
      <ToolsSection />
      <ResourcesPreview />
      <ProductsPreview />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
};

export default Index;
