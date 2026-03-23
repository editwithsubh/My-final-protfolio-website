import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { User, Mail, Link as LinkIcon, Camera, Coffee, Plane, Book, Clapperboard, MonitorPlay, Film, Scissors, Play } from "lucide-react";

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
  { name: "Pr", file: "Premiere", color: "bg-[#2F2F6A] text-[#E982FC]" },
  { name: "Ae", file: "After Effects", color: "bg-[#2F2F6A] text-[#D8A1FF]" },
  { name: "Ca", file: "CapCut", color: "bg-black text-white" },
  { name: "Rv", file: "Resolve", color: "bg-black text-white" },
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
  { num: "01", text1: "Cinematic", text2: "Montages" },
  { num: "02", text1: "Short-Form", text2: "Content" },
  { num: "03", text1: "Motion", text2: "Graphics" },
  { num: "04", text1: "YouTube", text2: "Documentaries" },
];

const About = () => {
  return (
    <div className="bg-off-white text-deep-black font-body overflow-x-hidden">
      {/* Light Grid Section */}
      <section className="section-light min-h-screen pt-32 pb-24 relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          
          {/* Top Banner Header */}
          <ScrollReveal>
            <h1 className="font-heading text-3xl md:text-5xl font-medium mb-16 tracking-tight">
              Namaste ji, This is my <span className="bg-brutal-yellow px-2 py-1 inline-block -rotate-1 border border-deep-black shadow-[2px_2px_0px_#111]">video portfolio</span>
            </h1>
          </ScrollReveal>

          {/* Intro Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24 items-start">
            {/* Portrait Tape Card */}
            <div className="lg:col-span-4 relative tape">
              <ScrollReveal direction="left">
                <div className="border-4 border-deep-black bg-white p-2 shadow-[8px_8px_0px_#111] rotate-2 transition-transform hover:rotate-0">
                  <div className="aspect-[3/4] bg-light-gray relative flex items-center justify-center overflow-hidden">
                    {/* Placeholder for real image */}
                    <User size={100} className="text-mid-gray/50" />
                    
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
            <div className="lg:col-span-8 pt-4 lg:pl-8 relative">
              <ScrollReveal direction="right">
                {/* Hand drawn arrows */}
                <div className="absolute right-0 top-12 opacity-80 hidden md:flex flex-col items-center">
                  <span className="font-handwritten text-xl text-mid-gray -rotate-6">About me</span>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ml-8 rotate-12">
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
                    <div className="absolute -right-24 top-1/2 opacity-70 hidden md:flex items-center gap-2">
                       <svg width="30" height="20" viewBox="0 0 30 20" fill="none" className="rotate-12">
                         <path d="M30 10C20 10 10 5 2 15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
                         <path d="M5 8L2 15L9 18" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                       </svg>
                       <span className="font-handwritten text-lg -rotate-6 text-mid-gray">Get in touch</span>
                    </div>

                    <a href="mailto:hello@editxsubh.com" className="flex items-center gap-3 hover:text-orange transition-colors">
                      <div className="w-8 h-8 rounded-full border-2 border-deep-black bg-brutal-yellow flex items-center justify-center">
                        <Mail size={14} />
                      </div>
                      hello@editxsubh.com
                    </a>
                    <a href="https://editxsubh.com" className="flex items-center gap-3 hover:text-orange transition-colors">
                      <div className="w-8 h-8 rounded-full border-2 border-deep-black bg-orange flex items-center justify-center text-white">
                        <LinkIcon size={14} />
                      </div>
                      https://editxsubh.com/portfolio
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* WORK EXPERIENCE */}
            <div className="md:col-span-12 lg:col-span-6 relative">
               <ScrollReveal>
                  <div className="mb-6 relative">
                    {/* Handwritten note */}
                    <div className="absolute top-0 right-12 opacity-80 hidden sm:flex items-end gap-2 -translate-y-6">
                      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="-rotate-12">
                         <path d="M40 10C30 15 10 15 2 5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
                         <path d="M8 0L2 5L2 12" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="font-handwritten text-xl text-mid-gray -rotate-3">what I've done</span>
                    </div>
                    
                    <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-lg">
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
            <div className="md:col-span-6 lg:col-span-3">
              <ScrollReveal delay={0.1}>
                 <div className="mb-6 relative">
                    <h3 className="inline-block bg-brutal-yellow border-2 border-deep-black px-4 py-2 shadow-[4px_4px_0px_#111] font-mono font-bold uppercase text-lg">
                      - CREATIVE SKILLS
                    </h3>
                    <span className="absolute -right-16 top-0 font-handwritten text-lg text-mid-gray rotate-6 hidden xl:block">things I can do</span>
                 </div>

                 <div className="space-y-4">
                   {skills.map((skill) => (
                     <div key={skill.name} className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold w-32 shrink-0">{skill.name}</span>
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
                 <div className="grid grid-cols-3 gap-4">
                    {tools.map((tool) => (
                      <div key={tool.name} className="flex flex-col items-center gap-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                        <div className={`w-12 h-12 rounded-full border-[3px] border-deep-black shadow-[3px_3px_0px_#111] flex items-center justify-center font-display text-xl tracking-wider ${tool.color}`}>
                          {tool.name}
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

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
           <ScrollReveal>
              <div className="relative inline-block mb-24 mt-16">
                 {/* Table of Content Title Overlay Mimicking Reference */}
                 <span className="font-handwritten text-brutal-yellow text-4xl md:text-6xl absolute -top-8 -left-12 -rotate-6">Table of</span>
                 <h2 className="font-display text-7xl md:text-[140px] leading-none uppercase tracking-widest relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                   Content
                 </h2>
                 {/* Decorative Line crossing behind/in front of text */}
                 <div className="absolute top-1/2 left-[110%] w-[50vw] h-1 bg-brutal-yellow/80 origin-left scale-x-100"></div>
              </div>
           </ScrollReveal>

           {/* TOC Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 lg:gap-y-24 gap-x-12 px-8 lg:px-24">
              {categories.map((cat, i) => (
                 <ScrollReveal key={cat.num} delay={i * 0.1} className="relative group cursor-pointer text-left md:text-center text-white/50 hover:text-white transition-colors duration-300">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
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
                    </div>
                 </ScrollReveal>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
