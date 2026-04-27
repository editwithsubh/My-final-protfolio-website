import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { formatPrice } from "@/lib/pricing";
import { Play, ArrowRight, Instagram, Twitter, MessageCircle, Send, PlayCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Marquee from "@/components/layout/Marquee";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

/* ─── HERO SECTION ─── */
const HeroSection = () => (
  <section className="bg-off-white min-h-[100dvh] flex items-center pt-20 pb-12 md:pb-0 relative overflow-hidden">
    <div className="absolute inset-0 grid-paper opacity-50 z-0 pointer-events-none" />
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px] w-full py-8 md:py-0 relative z-10">
      
      {/* Hand drawn arrows - hidden on mobile */}
      <div className="absolute left-10 top-0 opacity-80 hidden md:flex flex-col items-center">
         <span className="font-handwritten text-xl text-mid-gray -rotate-6">Creative Portfolio</span>
         <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ml-8 rotate-12">
            <path d="M2.5 3.5C12.5 6.5 35 15 32 35" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
            <path d="M25 30L32 35L38 28" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* Left content — 7 cols */}
        <motion.div
           className="lg:col-span-7 space-y-4 sm:space-y-6 order-2 lg:order-1"
           initial={{ opacity: 0, x: -40 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
           <p className="font-mono text-xs sm:text-sm font-bold text-deep-black uppercase tracking-widest bg-brutal-yellow inline-block px-2 sm:px-3 py-1 border-2 border-deep-black shadow-[3px_3px_0px_#111] mb-2 -rotate-1">
             <span className="animate-pulse mr-1 sm:mr-2">●</span> Available For Projects
           </p>
           
           <h1 className="font-display text-[clamp(2.8rem,13vw,7rem)] sm:text-[clamp(3rem,12vw,5rem)] md:text-[clamp(4rem,10vw,7rem)] lg:text-[110px] leading-[0.9] tracking-tighter text-deep-black uppercase break-words">
             SHUBHAM <br/>
             <span className="text-white bg-deep-black px-2 sm:px-4 inline-block transform rotate-1 border-2 sm:border-4 border-deep-black shadow-[3px_3px_0px_rgba(243,198,35,1)] sm:shadow-[4px_4px_0px_rgba(243,198,35,1)] md:shadow-[6px_6px_0px_rgba(243,198,35,1)]">SHARMA</span>
           </h1>
           
           <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-l-2 sm:border-l-4 border-deep-black pl-4 sm:pl-6">
             <p className="font-heading font-black text-lg sm:text-xl md:text-2xl text-deep-black uppercase">
               Video Editor & Motion Designer
             </p>
             <p className="font-mono text-xs sm:text-sm md:text-base text-deep-black/80 max-w-lg leading-relaxed font-bold">
               Helping creators and brands turn raw ideas into high-retention cinematic content. I don't just cut clips—I build experiences.
             </p>
           </div>

           {/* Brutalist CTAs */}
           <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6">
             <Link
               to="/portfolio"
               className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-deep-black text-white font-mono font-bold text-xs sm:text-sm uppercase hover:bg-brutal-yellow hover:text-deep-black hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-deep-black hover:shadow-[4px_4px_0px_#111] shadow-[2px_2px_0px_#111]"
             >
               View Portfolio <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
             </Link>
             <Link
               to="/resources"
               className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-deep-black font-mono font-bold text-xs sm:text-sm uppercase hover:bg-light-gray hover:-translate-y-1 transition-all duration-200 border-2 border-deep-black shadow-[4px_4px_0px_#111]"
             >
               The Vault
             </Link>
           </div>
        </motion.div>

        {/* Right — Polaroid Collage */}
        <motion.div
           className="lg:col-span-5 flex justify-center lg:justify-end relative order-1 lg:order-2"
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
           {/* Decorative Tapes & shapes */}
           <div className="absolute top-10 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-brutal-yellow rounded-full border-2 sm:border-4 border-deep-black blur-md opacity-20 -z-10" />
           <div className="absolute -bottom-6 sm:-bottom-10 -left-6 sm:-left-10 w-28 sm:w-40 h-28 sm:h-40 bg-[#D8A1FF] rounded-none border-2 sm:border-4 border-deep-black blur-md opacity-20 -z-10 rotate-12" />

           {/* Main Polaroid */}
           <div className="relative rotate-3 hover:rotate-0 transition-transform duration-500 w-[80%] sm:w-full max-w-sm">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-14 sm:20 h-6 sm:8 bg-brutal-yellow rotate-[-5deg] border border-deep-black/20 mix-blend-multiply opacity-90 z-20" />
              <div className="bg-white p-2 sm:p-3 pb-8 sm:pb-12 border-2 sm:border-4 border-deep-black shadow-[8px_8px_0px_#111] sm:shadow-[12px_12px_0px_#111] relative z-10 w-full">
                 <div className="aspect-[4/5] bg-near-black border-2 border-deep-black overflow-hidden relative">
                    <img
                      src="/images/hero-portrait.png"
                      alt="Shubham Sharma portrait"
                      width={400}
                      height={500}
                      fetchPriority="high"
                      className="w-full h-full object-cover object-[center_18%] scale-105"
                    />
                   {/* Record dot indicator */}
                   <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-1 sm:gap-2 bg-deep-black/60 backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 border border-white/10 rounded">
                      <div className="w-1.5 sm:2 h-1.5 sm:2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-mono text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest">REC</span>
                   </div>
                 </div>
                 {/* Handwritten note on bottom of polaroid */}
                 <p className="font-handwritten text-lg sm:2xl text-deep-black text-center absolute bottom-2 sm:bottom-3 w-full -rotate-2">That's me!</p>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── ABOUT SNIPPET (Already brutalist, just ensuring standard classnames) ─── */
const AboutSnippet = () => (
  <section className="bg-light-gray py-16 sm:py-24 relative overflow-hidden border-y-2 sm:border-y-4 border-deep-black">
    {/* Right Edge Vertical Label */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 transform rotate-90 origin-right text-xs font-mono tracking-[0.2em] text-deep-black/60 hidden lg:block font-bold">
      SHUBHAM © 2025
    </div>

    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px]">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 sm:gap-12 lg:gap-20">
        
        {/* Photo Container */}
        <ScrollReveal direction="left" className="relative group w-full md:w-[40%]">
          <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-full h-full bg-brutal-yellow border-2 sm:border-4 border-deep-black transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <div className="relative aspect-[3/4] overflow-hidden border-2 sm:border-4 border-deep-black bg-white">
            <img
              src="/images/about-portrait.png"
              alt="Shubham Sharma"
              width={300}
              height={400}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[center_20%] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
          {/* Black tape */}
          <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-12 sm:16 h-6 sm:8 bg-deep-black rotate-[12deg] z-20" />
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal direction="right" className="flex-1 space-y-4 sm:space-y-6">
          <h2 className="inline-block bg-white border-2 border-deep-black px-3 sm:px-4 py-1.5 sm:py-2 shadow-[3px_3px_0px_#111] sm:shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-sm sm:text-lg mb-2">
            - QUICK BIO
          </h2>
          
          <h3 className="font-display text-[clamp(2.5rem,8vw,4rem)] sm:text-[clamp(3rem,12vw,5rem)] md:text-6xl text-deep-black uppercase leading-none break-words">
            HIRE ME <br/> <span className="text-[#D8A1FF] drop-shadow-[2px_2px_0px_#111]">MAYBE?</span>
          </h3>

          <div className="space-y-3 sm:space-y-4 font-body text-deep-black/90 text-sm sm:text-base leading-relaxed max-w-xl">
            <p className="font-medium">
              I'm <strong className="font-black bg-brutal-yellow px-1">Shubham Sharma</strong>, a self-taught video editor & motion graphics specialist. I love creating visuals that don't just look good - they tell a story. From social media content to high-end commercials, I enjoy bringing ideas to life.
            </p>
            <p>
              I explore different editing styles and visual effects to add depth to my work. For me, editing is all about connecting ideas with people in a creative, retention-driven way.
            </p>
          </div>

          <div className="pt-4 sm:pt-6">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-deep-black text-white font-mono font-bold text-xs sm:text-sm uppercase hover:bg-brutal-yellow hover:text-deep-black transition-colors duration-200 shadow-[3px_3px_0px_#D8A1FF] sm:shadow-[4px_4px_0px_#D8A1FF]"
            >
              Full Manifesto <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

/* ─── PORTFOLIO PREVIEW (Brutalist Grid) ─── */
const PortfolioPreview = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('featured_home', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      const fallback = data?.length ? data : await supabase
        .from('portfolio_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
        .then(res => res.data);

      if (isMounted) setProjects(fallback || []);
    };
    fetchVideos();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="bg-deep-black py-16 sm:py-24 md:py-32 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px]">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-6 mb-10 sm:mb-16 border-b-2 sm:border-b-4 border-off-white pb-4 sm:pb-6">
             <div>
                <p className="font-mono text-xs sm:text-sm font-bold text-brutal-yellow uppercase mb-2">&gt;_ SELECTED WORKS</p>
                <h2 className="font-display text-[clamp(2rem,8vw,4rem)] sm:text-[clamp(3rem,12vw,5rem)] md:text-7xl text-off-white tracking-wider uppercase break-words">PORTFOLIO</h2>
             </div>
             <Link to="/portfolio" className="group flex items-center gap-2 bg-off-white text-deep-black px-5 sm:px-6 py-2.5 sm:py-3 font-mono font-bold text-xs sm:text-sm uppercase border-2 border-off-white hover:bg-transparent hover:text-off-white transition-colors duration-300">
                View Archives <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1" />
             </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {projects.map((project, i) => (
             <StaggerContainer key={project.id || i}>
                <StaggerItem>
                  <Link to="/portfolio" className="group block relative bg-near-black border-2 border-dark-gray hover:border-brutal-yellow transition-all duration-300 shadow-[4px_4px_0px_#000] sm:shadow-[6px_6px_0px_#000] hover:-translate-y-1">
                     <div className={`relative ${project.video_type === 'short' ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden border-b-2 border-dark-gray group-hover:border-brutal-yellow transition-colors`}>
                        <img 
                           src={getYouTubeThumbnail(project.video_id)} 
                           alt={project.title}
                           width={640}
                           height={360}
                           loading="lazy"
                           decoding="async"
                           className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                           <div className="w-12 sm:w-16 h-12 sm:h-16 bg-brutal-yellow rounded-full border-2 sm:border-4 border-deep-black flex items-center justify-center text-deep-black scale-50 group-hover:scale-100 transition-transform duration-300 delay-100">
                             <Play fill="currentColor" className="w-5 sm:w-6 h-5 sm:h-6 ml-0.5 sm:ml-1" />
                           </div>
                        </div>
                     </div>
                     <div className="p-4 sm:p-6">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                           <span className="font-mono text-[10px] font-bold text-brutal-yellow uppercase tracking-widest border border-brutal-yellow/30 px-1.5 sm:px-2 py-0.5">
                              {(project.category || 'Editing').split(',')[0].trim()}
                           </span>
                           <span className="font-mono text-[10px] text-mid-gray">IDX-{i+1}</span>
                        </div>
                        <h3 className="font-heading font-black text-base sm:text-xl text-off-white uppercase leading-tight line-clamp-2">
                           {project.title}
                        </h3>
                     </div>
                  </Link>
                </StaggerItem>
             </StaggerContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── SERVICES (Brutalist Cards) ─── */
const services = [
  { prefix: "01", title: "YouTube Video Editing", tools: ["Premiere Pro", "After Effects"] },
  { prefix: "02", title: "Short-Form Content", tools: ["CapCut", "Premiere Pro"] },  
  { prefix: "03", title: "Motion Graphics", tools: ["After Effects", "Figma"] },
  { prefix: "04", title: "Color Grading", tools: ["DaVinci Resolve"] }
];

const ServicesSection = () => (
  <section className="bg-[#D8A1FF] py-16 sm:py-24 md:py-32 relative border-y-2 sm:border-y-4 border-deep-black">
    {/* Noise Grid */}
    <div className="absolute inset-0 grid-paper opacity-30 mix-blend-multiply pointer-events-none" />
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px] relative z-10">
      
      <ScrollReveal>
        <div className="text-center mb-12 sm:mb-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] sm:h-[4px] bg-deep-black -z-10" />
          <h2 className="font-display text-[clamp(2rem,8vw,4rem)] sm:text-[clamp(3rem,11vw,5rem)] md:text-7xl text-deep-black uppercase tracking-widest bg-[#D8A1FF] inline-block px-4 sm:px-8 py-2 border-2 sm:border-4 border-deep-black shadow-[4px_4px_0px_#111] sm:shadow-[6px_6px_0px_#111] break-words">
            SERVICES
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        {services.map((service, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="bg-white border-2 sm:border-4 border-deep-black p-6 sm:p-8 md:p-10 shadow-[4px_4px_0px_#111] sm:shadow-[8px_8px_0px_#111] hover:shadow-[6px_6px_0px_#111] sm:hover:shadow-[12px_12px_0px_#111] hover:-translate-y-1 transition-all duration-300 relative group">
              <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-brutal-yellow border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-deep-black flex items-center justify-center font-display text-2xl sm:text-3xl text-deep-black">
                {service.prefix}
              </div>
              
              <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-deep-black uppercase mb-3 sm:mb-4 pr-12 sm:pr-12">
                {service.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mt-6 sm:mt-8">
                {service.tools.map((tool) => (
                  <span key={tool} className="font-mono text-xs font-bold text-white bg-deep-black uppercase px-2 sm:px-3 py-1 border-2 border-transparent">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ─── WORKFLOW (Blueprint Style) ─── */
const WorkflowSection = () => {
  const steps = [
    { step: "01", title: "Pre-Production", desc: "Brief, scripts, and asset organization." },
    { step: "02", title: "Rough Cut", desc: "Assembly, pacing, and narrative structure." },
    { step: "03", title: "VFX & Motion", desc: "Compositing, titles, and dynamic animation." },
    { step: "04", title: "Polish", desc: "Color grading, sound design, and mastering." }
  ];

  return (
    <section className="bg-off-white py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <ScrollReveal>
          <div className="mb-10 sm:mb-16">
            <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-3 sm:px-4 py-1.5 sm:py-2 shadow-[3px_3px_0px_#111] sm:shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-sm sm:text-lg mb-4 sm:mb-6">
              - CREATIVE WORKFLOW
            </h3>
            <h2 className="font-display text-[clamp(2rem,8vw,4rem)] sm:text-[clamp(3rem,12vw,5rem)] md:text-7xl text-deep-black uppercase break-words">
              THE BLUEPRINT
            </h2>
          </div>
        </ScrollReveal>

        {/* Desktop: horizontal grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 relative">
          <div className="absolute top-[120px] left-8 right-8 h-1 bg-deep-black border-y border-dashed border-white" />
          {steps.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-light-gray border-2 border-deep-black p-6 relative group z-10 hover:bg-brutal-yellow transition-colors duration-300">
                 <div className="w-16 h-16 bg-white border-2 border-deep-black rounded-full flex items-center justify-center font-display text-3xl mb-6 shadow-[4px_4px_0px_#111] group-hover:scale-110 transition-transform">
                    {item.step}
                 </div>
                 <h4 className="font-heading font-black text-xl text-deep-black uppercase mb-3">{item.title}</h4>
                 <p className="font-mono text-sm text-deep-black/70 font-bold">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="flex flex-col gap-0 relative lg:hidden">
          <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-deep-black/20" />
          {steps.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="flex gap-4 pb-8 relative">
                <div className="w-12 h-12 rounded-full bg-brutal-yellow border-2 border-deep-black flex items-center justify-center font-mono font-bold shrink-0 z-10 shadow-[3px_3px_0px_#111]">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h4 className="font-heading font-black text-lg text-deep-black uppercase">{item.title}</h4>
                  <p className="font-mono text-sm text-deep-black/70 font-bold mt-1">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── VAULT & BLOG PREVIEWS (Combined "Insight" layout) ─── */
const InsightsPreview = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchInsights = async () => {
      const [featuredBlogs, featuredResources] = await Promise.all([
        supabase
          .from('blogs')
          .select('id, title, slug, cover_image, excerpt, created_at, featured_home')
          .eq('featured_home', true)
          .or('status.is.null,status.eq.published')
          .order('created_at', { ascending: false })
          .limit(2),
        supabase
          .from('resources')
          .select('id, title, cover_image, excerpt, description, type, is_paid, price, currency, badge, created_at, featured_home')
          .eq('featured_home', true)
          .or('status.is.null,status.eq.published')
          .order('created_at', { ascending: false })
          .limit(2),
      ]);

      const needsBlogFallback = featuredBlogs.error || !featuredBlogs.data || featuredBlogs.data.length === 0;
      const needsResourceFallback = featuredResources.error || !featuredResources.data || featuredResources.data.length === 0;

      const [fallbackBlogs, fallbackResources] = await Promise.all([
        needsBlogFallback
          ? supabase
              .from('blogs')
              .select('id, title, slug, cover_image, excerpt, created_at')
              .or('status.is.null,status.eq.published')
              .order('created_at', { ascending: false })
              .limit(2)
          : Promise.resolve({ data: featuredBlogs.data, error: null }),
        needsResourceFallback
          ? supabase
              .from('resources')
              .select('id, title, cover_image, excerpt, description, type, is_paid, price, currency, badge, created_at')
              .or('status.is.null,status.eq.published')
              .order('created_at', { ascending: false })
              .limit(2)
          : Promise.resolve({ data: featuredResources.data, error: null }),
      ]);

      if (!isMounted) return;

      setBlogs(fallbackBlogs.data || []);
      setResources(fallbackResources.data || []);
    };

    void fetchInsights();
    return () => { isMounted = false; };
  }, []);

  if (blogs.length === 0 && resources.length === 0) return null;

  return (
    <section className="bg-deep-black py-12 sm:py-16 md:py-24 border-t-2 sm:border-t-4 border-brutal-yellow">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px]">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-10 sm:mb-12 gap-4 sm:gap-6">
            <div className="min-w-0">
              <h2 className="font-display text-[clamp(2rem,8vw,3.75rem)] md:text-6xl text-off-white uppercase break-words leading-none">
                THE <span className="text-brutal-yellow">VAULT</span>
              </h2>
              <p className="font-mono text-xs sm:text-sm md:text-base text-off-white/70 mt-2 sm:mt-3 max-w-lg font-bold">
                Learn exactly how I structure my videos. Access free presets, project files, and detailed production logs.
              </p>
            </div>
            <Link to="/resources" className="inline-flex bg-brutal-yellow text-deep-black px-5 sm:px-6 py-2.5 sm:py-3 font-mono font-bold text-xs sm:text-sm uppercase hover:bg-white transition-colors w-full md:w-auto text-center justify-center">
               Enter Vault
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:gap-6">
           {/* Resources */}
            {resources.map((item, i) => (
               <StaggerContainer key={`res-${i}`}>
                  <StaggerItem>
                    <Link to={`/resources/${item.id}`} className="group block bg-white border-2 border-brutal-yellow relative hover:-translate-y-1 transition-transform">
                       <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-brutal-yellow text-deep-black font-mono text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 border border-deep-black z-10">Asset</div>
                       <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex flex-col items-end gap-1 z-10">
                         <span className={`font-mono text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 border border-deep-black ${item.is_paid ? 'bg-yellow-300 text-deep-black' : 'bg-emerald-400 text-deep-black'}`}>
                           {item.is_paid ? 'Premium' : 'Free'}
                         </span>
                         {item.badge && <span className="bg-orange text-white font-mono text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 border border-deep-black">{item.badge}</span>}
                       </div>
                       <div className="aspect-[4/3] bg-mid-gray relative overflow-hidden border-b-2 border-brutal-yellow">
                          {item.cover_image ? (
                            <img src={item.cover_image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                          ) : <div className="absolute inset-0 grid-paper opacity-50" />}
                       </div>
                       <div className="p-3 sm:p-4">
                          <h3 className="font-heading font-black text-base sm:text-lg uppercase truncate">{item.title}</h3>
                          <p className="mt-1 sm:mt-2 text-xs font-mono text-deep-black/70 line-clamp-2">{item.excerpt || item.description?.replace(/<[^>]+>/g, ' ').trim() || 'Open this vault item from the homepage.'}</p>
                       </div>
                   </Link>
                  </StaggerItem>
               </StaggerContainer>
            ))}
           {/* Blogs */}
           {blogs.map((item, i) => (
              <StaggerContainer key={`blog-${i}`}>
                 <StaggerItem>
                   <Link to={`/blog/${item.slug}`} className="group block bg-white border-2 border-[#D8A1FF] relative hover:-translate-y-1 transition-transform">
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-[#D8A1FF] text-deep-black font-mono text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 border border-deep-black z-10">Log</div>
                      <div className="aspect-[4/3] bg-mid-gray relative overflow-hidden border-b-2 border-[#D8A1FF]">
                         {item.cover_image ? (
                           <img src={item.cover_image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                         ) : <div className="absolute inset-0 bg-deep-black flex items-center justify-center"><BookOpen className="text-[#D8A1FF]/30 w-8 sm:w-12 h-8 sm:h-12" /></div>}
                      </div>
                      <div className="p-3 sm:p-4">
                         <h3 className="font-heading font-black text-base sm:text-lg uppercase truncate">{item.title}</h3>
                      </div>
                   </Link>
                 </StaggerItem>
              </StaggerContainer>
           ))}
        </div>
      </div>
    </section>
  );
};

/* ─── FINAL CTA ─── */
const FinalCTA = () => (
  <section className="bg-orange py-16 sm:py-24 md:py-32 relative overflow-hidden border-y-2 sm:border-y-4 border-deep-black">
    <div className="absolute inset-0 grid-paper opacity-20 pointer-events-none mix-blend-multiply" />
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px] text-center relative z-10">
      <ScrollReveal>
        <span className="font-handwritten text-xl sm:text-2xl sm:text-3xl text-deep-black -rotate-3 inline-block mb-3 sm:mb-4 bg-white px-3 sm:px-4 border-2 border-deep-black shadow-[3px_3px_0px_#111] sm:shadow-[4px_4px_0px_#111]">Stop reading, let's work!</span>
        <h2 className="font-display text-[clamp(2.5rem,10vw,4rem)] sm:text-[clamp(3rem,15vw,6rem)] md:text-[90px] leading-[0.9] sm:leading-none text-white tracking-widest mb-6 sm:mb-10 drop-shadow-[3px_3px_0px_#111] sm:drop-shadow-[4px_4px_0px_#111] uppercase break-words md:break-normal">
          START A PROJECT
        </h2>
        
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-deep-black text-white font-mono font-bold text-sm sm:text-xl uppercase hover:bg-brutal-yellow hover:text-deep-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] sm:hover:shadow-[6px_6px_0px_#111] transition-all duration-200 border-2 sm:border-4 border-transparent hover:border-deep-black"
        >
          Send Transmission <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6" />
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
      <WorkflowSection />
      <TestimonialsSection />
      <InsightsPreview />
      <FinalCTA />
    </>
  );
};

export default Index;
