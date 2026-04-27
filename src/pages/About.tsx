import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Mail, Link as LinkIcon, Camera, Coffee, Plane, Book, Clapperboard, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const timeline = [
  {
    period: "Dec 2025 - Present",
    role: "Motion Graphics Designer",
    company: "Revision Wave",
    description: "Creating high-quality motion graphics and visual effects for diverse clients.",
  },
  {
    period: "Jan 2025 - Jul 2025",
    role: "Freelance Content Creator",
    company: "Self-employed",
    description: "Cinematic video editing and short-form content for brands and startups.",
  },
];

const skills = [
  { name: "BRANDING", level: 7 },
  { name: "VIDEO EDITING", level: 9 },
  { name: "MOTION DESIGN", level: 8 },
  { name: "COLOR GRADING", level: 8 },
  { name: "SOUND DESIGN", level: 7 },
];

const tools = [
  { name: "Ps", file: "Photoshop", icon: "/images/media__1775898455016.png" },
  { name: "Ae", file: "After Effects", icon: "/images/media__1775898455042.png" },
  { name: "Rv", file: "Resolve", icon: "/images/media__1775898455048.png" },
  { name: "Pr", file: "Premiere Pro", icon: "/images/media__1775898455098.png" },
];

const hobbies = [
  { icon: Camera, name: "MOUNTAIN PHOTOGRAPHY" },
  { icon: Coffee, name: "TEA LOVER" },
  { icon: Plane, name: "TRAVEL" },
  { icon: Book, name: "POETRY" },
  { icon: Clapperboard, name: "VISUAL STORIES" },
];

const facts = [
  { number: "500+", text: "Videos edited & delivered" },
  { number: "1M+", text: "Views generated across platforms" },
  { number: "2K+", text: "Cups of coffee consumed" },
  { number: "50+", text: "Satisfied creators & brands" },
];

const categories = [
  { num: "01", text1: "Cinematic", text2: "Montages", linkQuery: "Brand Films" },
  { num: "02", text1: "Short-Form", text2: "Content", linkQuery: "Short-Form" },
  { num: "03", text1: "Motion", text2: "Graphics", linkQuery: "Motion Graphics" },
  { num: "04", text1: "YouTube", text2: "Documentaries", linkQuery: "YouTube" },
];

const About = () => {
  return (
    <div className="bg-off-white text-deep-black font-body overflow-x-hidden">
      {/* Light Grid Section */}
      <section className="section-light min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          {/* Top Banner Header */}
          <ScrollReveal>
            <h1 className="font-heading text-3xl md:text-5xl font-medium mb-16 tracking-tight">
              Namaste ji, This is my <span className="bg-brutal-yellow px-2 py-1 inline-block -rotate-1 border border-deep-black shadow-[2px_2px_0px_#111]">video portfolio</span>
            </h1>
          </ScrollReveal>

          {/* Intro Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-8 mb-16 sm:mb-24 items-start">
            {/* Portrait Tape Card */}
            <div className="md:col-span-1 lg:col-span-4 relative tape order-first lg:order-last">
              <ScrollReveal direction="left">
                <div className="border-4 border-deep-black bg-white p-2 shadow-[8px_8px_0px_#111] rotate-2 transition-transform hover:rotate-0">
                  <div className="aspect-[3/4] bg-white relative overflow-hidden">
                    <img
                      src="/images/about-page-photo.png"
                      alt="Shubham Sharma — Video Editor"
                      width={300}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain object-center scale-[1.02]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML += '<div class="flex items-center justify-center w-full h-full"><span class="text-mid-gray/50 text-6xl">📸</span></div>';
                      }}
                    />
                    
                    {/* Decorative bits */}
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-brutal-yellow rotate-12 border-2 border-deep-black"></div>
                  </div>
                </div>
                {/* Black tapes on corners mimicking the reference */}
                <div className="absolute -top-4 -right-4 w-16 h-6 bg-deep-black rotate-[30deg]"></div>
                <div className="absolute -bottom-6 -left-2 w-20 h-7 bg-deep-black rotate-[15deg]"></div>
              </ScrollReveal>
            </div>

            {/* Bio Content */}
            <div className="md:col-span-1 lg:col-span-8 pt-4 lg:pl-8 relative order-last lg:order-last">
              <ScrollReveal direction="right">
                {/* Hand drawn arrows */}
                <div className="absolute right-0 top-4 lg:top-12 opacity-80 hidden md:flex flex-col items-center max-w-[120px] pointer-events-none">
                  <span className="font-handwritten text-lg lg:text-xl text-mid-gray -rotate-6 text-right leading-tight">About me</span>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ml-6 lg:ml-8 rotate-12 shrink-0">
                     <path d="M2.5 3.5C12.5 6.5 35 15 32 35" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                     <path d="M25 30L32 35L38 28" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h2 className="font-display text-5xl md:text-7xl mb-2 tracking-wide uppercase">
                  Shubham Sharma
                </h2>
                <div className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-1 mb-6 shadow-[3px_3px_0px_#111] font-heading font-bold uppercase text-sm md:text-base">
                  Video Editor & Motion Graphics Designer
                </div>

                <p className="text-base md:text-lg text-deep-black/90 leading-relaxed font-medium mb-12 max-w-2xl">
                  Greetings Ladies and Gentlemen, allow me to introduce myself. 
                  I am a self-taught, passionate Video Editor & Motion Graphics Designer. 
                  Looking at a well-structured edit always makes me smile, that's why I wanted to get into creative storytelling to put smiles on people's faces. Every cut serves the narrative.
                </p>

                {/* Contacts Mini Bento */}
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="bg-brutal-yellow font-heading font-black p-3 border-2 border-deep-black shadow-[4px_4px_0px_#111] uppercase whitespace-pre-line text-sm leading-tight text-center">
                    CONT<br/>ACTS
                  </div>
                  
                  <div className="space-y-4 font-mono text-sm relative">
                    <div className="absolute -right-4 lg:-right-20 xl:-right-24 top-1/2 -translate-y-1/2 opacity-70 hidden lg:flex items-center gap-2 max-w-[140px] pointer-events-none">
                       <svg width="30" height="20" viewBox="0 0 30 20" fill="none" className="rotate-12 shrink-0">
                         <path d="M30 10C20 10 10 5 2 15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
                         <path d="M5 8L2 15L9 18" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                       </svg>
                       <span className="font-handwritten text-base xl:text-lg -rotate-6 text-mid-gray leading-tight">Get in touch</span>
                    </div>

                    <a href="mailto:shubhams6068@gmail.com" className="flex items-center gap-3 hover:text-orange transition-colors break-all sm:break-normal">
                      <div className="w-8 h-8 shrink-0 rounded-full border-2 border-deep-black bg-brutal-yellow flex items-center justify-center">
                        <Mail size={14} />
                      </div>
                      shubhams6068@gmail.com
                    </a>
                    <a href="https://www.editwithshub.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-orange transition-colors">
                      <div className="w-8 h-8 shrink-0 rounded-full border-2 border-deep-black bg-orange flex items-center justify-center text-white">
                        <LinkIcon size={14} />
                      </div>
                      Portfolio
                    </a>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <a href="https://x.com/editxshub" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-deep-black bg-white hover:bg-brutal-yellow transition-colors" aria-label="X (Twitter)">
                        <Twitter size={16} />
                      </a>
                      <a href="https://www.linkedin.com/in/editxsubh/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-deep-black bg-white hover:bg-brutal-yellow transition-colors" aria-label="LinkedIn">
                        <Linkedin size={16} />
                      </a>
                      <a href="https://www.instagram.com/editwithshub/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-deep-black bg-white hover:bg-brutal-yellow transition-colors" aria-label="Instagram">
                        <Instagram size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12">
            
            {/* WORK EXPERIENCE */}
            <div className="md:col-span-12 lg:col-span-6 relative">
               <ScrollReveal>
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 text-mid-gray opacity-90">
                      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="-rotate-12 shrink-0 hidden sm:block" aria-hidden>
                         <path d="M40 10C30 15 10 15 2 5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
                         <path d="M8 0L2 5L2 12" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="font-handwritten text-lg sm:text-xl text-mid-gray -rotate-1 sm:-rotate-3">what I&apos;ve done</span>
                    </div>
                    <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-base sm:text-lg">
                      - WORK EXPERIENCE
                    </h3>
                  </div>

                  <div className="space-y-8 pl-4 border-l-[3px] border-dashed border-deep-black/30">
                    {timeline.map((item, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 border-deep-black bg-brutal-yellow"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 items-start">
                          <div className="font-mono text-xs font-bold bg-deep-black text-white px-2 py-1 inline-block w-max self-start border border-deep-black">
                            {item.period}
                          </div>
                          <div className="sm:col-span-2">
                             <h4 className="font-heading font-bold text-lg leading-none mb-1">{item.company}</h4>
                             <p className="font-mono text-xs text-orange font-bold uppercase mb-3 bg-orange/10 px-2 py-0.5 inline-block">{item.role}</p>
                             <p className="font-body text-sm text-deep-black/70 leading-relaxed">Client Projects:<br/>{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* CREATIVE SKILLS */}
            <div className="md:col-span-6 lg:col-span-3 min-w-0">
              <ScrollReveal delay={0.1}>
                 <div className="mb-6 space-y-2">
                    <p className="font-handwritten text-lg text-mid-gray -rotate-1 pl-0.5 max-w-[14rem] leading-snug">
                      things I can do —
                    </p>
                    <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-base sm:text-lg">
                      - CREATIVE SKILLS
                    </h3>
                 </div>

                 <div className="space-y-4">
                   {skills.map((skill) => (
                     <div key={skill.name} className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span className="font-mono text-[10px] sm:text-xs font-bold w-[5.5rem] sm:w-32 shrink-0 leading-tight">{skill.name}</span>
                        <div className="flex-grow h-2 border border-deep-black rounded-full overflow-hidden bg-white/50 relative">
                          <div className="absolute top-0 left-0 bottom-0 bg-deep-black" style={{ width: `${(skill.level / 10) * 100}%` }}></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-brutal-yellow mr-1"></div>
                        </div>
                        <div className="w-6 h-6 shrink-0 bg-brutal-yellow border border-deep-black flex items-center justify-center font-mono text-xs font-bold shadow-[2px_2px_0px_#111]">
                          {skill.level}
                        </div>
                     </div>
                   ))}
                 </div>
              </ScrollReveal>
            </div>

            {/* CREATIVE TOOLS & HOBBIES combined column */}
            <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-12">
              {/* TOOLS */}
              <ScrollReveal delay={0.2}>
                 <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-lg mb-6">
                    - CREATIVE TOOLS
                 </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {tools.map((tool) => (
                      <div key={tool.name} className="flex flex-col items-center gap-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                        <div className={`w-12 h-12 rounded-full border-[3px] border-deep-black shadow-[3px_3px_0px_#111] flex items-center justify-center overflow-hidden bg-white`}>
                          {tool.icon ? (
                            <img src={tool.icon} alt={tool.name} className="w-[120%] h-[120%] object-cover" />
                          ) : (
                            <span className="font-display text-xl tracking-wider text-black">{tool.name}</span>
                          )}
                        </div>
                      </div>
                    ))}
                 </div>
              </ScrollReveal>

              {/* HOBBIES */}
              <ScrollReveal delay={0.3}>
                 <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-lg mb-6">
                    - HOBBIES & INTEREST
                 </h3>
                 <div className="flex flex-wrap gap-4">
                    {hobbies.map((hobby) => (
                       <div key={hobby.name} className="flex flex-col items-center gap-1 group">
                         <div className="w-10 h-10 flex items-center justify-center text-deep-black group-hover:text-orange transition-colors">
                           <hobby.icon size={26} strokeWidth={1.5} />
                         </div>
                         <span className="font-mono text-[8px] uppercase font-bold text-center tracking-tighter opacity-70">
                           {hobby.name}
                         </span>
                       </div>
                    ))}
                 </div>
              </ScrollReveal>
            </div>
            
            {/* RANDOM FACTS (Full width row) */}
            <div className="md:col-span-12 mt-4 pt-10 border-t border-dashed border-deep-black/30">
               <ScrollReveal delay={0.4}>
                 <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-lg mb-8">
                    - RANDOM FACTS
                 </h3>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {facts.map((fact, i) => (
                      <div key={i} className="flex flex-col items-center">
                         <span className="font-display text-5xl md:text-6xl text-deep-black drop-shadow-[2px_2px_0px_theme(colors.brutal-yellow)]">
                           {fact.number}
                         </span>
                         <p className="font-mono text-xs uppercase font-semibold text-mid-gray mt-2 w-32 leading-tight">
                           {fact.text}
                         </p>
                      </div>
                    ))}
                 </div>
               </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* Torn Edge Separator */}
      <div className="relative w-full h-12 -mt-6 z-20 pointer-events-none fill-deep-black transform scale-y-[-1]">
         <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full text-deep-black">
            <path d="M0,0 L1200,0 L1200,50 Q1180,70 1150,50 T1100,50 T1050,40 T1000,60 T950,50 T900,65 T850,40 T800,60 T750,40 T700,50 T650,30 T600,60 T550,40 T500,50 T450,30 T400,60 T350,40 T300,50 T250,35 T200,50 T150,35 T100,50 T50,30 L0,50 Z" />
         </svg>
      </div>

      {/* Bottom Dark Section (Table of Content) */}
      <section className="section-dark pb-32 pt-20 relative overflow-hidden">
        {/* Massive Background Text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden opacity-5 font-handwritten text-[25vw] whitespace-nowrap leading-none mt-10">
           Table of Contents
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center">
           <ScrollReveal>
              <div className="relative inline-block mb-16 sm:mb-24 mt-10 sm:mt-16 max-w-full">
                 {/* Table of Content Title Overlay Mimicking Reference */}
                 <span className="font-handwritten text-brutal-yellow text-3xl sm:text-4xl md:text-6xl absolute -top-6 sm:-top-8 left-1/2 -translate-x-[85%] sm:left-0 sm:translate-x-0 sm:-left-8 md:-left-12 -rotate-6 whitespace-nowrap">Table of</span>
                 <h2 className="font-display text-[clamp(3rem,14vw,8.75rem)] leading-none uppercase tracking-widest relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] break-words">
                   Content
                 </h2>
                 {/* Decorative Line crossing behind/in front of text */}
                 <div className="hidden md:block absolute top-1/2 left-[105%] lg:left-[110%] w-[min(50vw,28rem)] h-1 bg-brutal-yellow/80 origin-left"></div>
              </div>
           </ScrollReveal>

           {/* TOC Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 sm:gap-y-16 lg:gap-y-24 gap-x-6 md:gap-x-12 px-2 sm:px-6 md:px-12 lg:px-24">
              {categories.map((cat, i) => (
                 <ScrollReveal key={cat.num} delay={i * 0.1} className="relative group cursor-pointer text-left md:text-center text-white/50 hover:text-white transition-colors duration-300">
                    <Link to={`/portfolio?category=${encodeURIComponent(cat.linkQuery || '')}`} className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
                       {/* Absolute huge faint number */}
                       <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-display text-[150px] md:text-[200px] font-bold text-white/[0.03] select-none pointer-events-none transition-transform group-hover:scale-110 duration-500">
                          {cat.num}
                       </span>
                       <h3 className="font-display text-4xl md:text-5xl uppercase tracking-wider relative z-10 mt-8 md:mt-0 pt-12 md:pt-0">
                          {cat.text1}
                       </h3>
                       <span className="font-handwritten text-brutal-yellow text-3xl md:text-4xl absolute right-1/4 -bottom-6 rotate-[-5deg] lowercase opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all z-20">
                          {cat.text2}
                       </span>
                    </Link>
                 </ScrollReveal>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
