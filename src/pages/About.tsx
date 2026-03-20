import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { User, Briefcase, Heart } from "lucide-react";

const skills = [
  { name: "Adobe Premiere Pro", level: 95 },
  { name: "After Effects", level: 90 },
  { name: "DaVinci Resolve", level: 88 },
  { name: "CapCut", level: 90 },
  { name: "Canva", level: 85 },
  { name: "Filmora", level: 82 },
];

const timeline = [
  {
    period: "Dec 2025 — Present",
    role: "Motion Graphics Designer",
    company: "Revision Wave",
    description: "Creating high-quality motion graphics, animated intros, and visual effects for diverse clients.",
  },
  {
    period: "Jan 2025 — Jul 2025",
    role: "Freelance Content Creator",
    company: "Self-employed",
    description: "Delivered cinematic video editing and short-form content for creators, brands, and startups.",
  },
];

const values = [
  { icon: "⚡", title: "Quality", description: "Every frame is polished to perfection." },
  { icon: "🚀", title: "Speed", description: "Fast turnaround without compromising standards." },
  { icon: "📖", title: "Story", description: "Every edit serves the narrative." },
];

const About = () => {
  return (
    <>
      {/* Hero / Intro */}
      <section className="section-light pt-32 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile photo placeholder */}
            <ScrollReveal direction="left">
              <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-orange rounded-[40%_60%_55%_45%/50%_40%_60%_50%] opacity-90" />
                <div className="absolute inset-3 bg-near-black rounded-[40%_60%_55%_45%/50%_40%_60%_50%] flex items-center justify-center">
                  <User size={80} className="text-mid-gray" />
                </div>
                <div className="absolute -top-3 left-8 w-16 h-6 bg-off-white/70 rotate-[4deg] shadow-sm" />
                <div className="absolute -bottom-2 right-8 w-14 h-6 bg-yellow-highlight/50 -rotate-[3deg] shadow-sm" />
              </div>
            </ScrollReveal>

            {/* Text */}
            <ScrollReveal direction="right">
              <p className="font-handwritten text-xl text-orange mb-2">about me</p>
              <h1 className="font-display text-5xl md:text-7xl text-deep-black tracking-wider mb-4">
                SHUBHAM SHARMA
              </h1>
              <p className="font-body text-mid-gray leading-relaxed mb-4">
                I'm a Video Editor & Motion Graphics Specialist based in Jaipur, India.
                I help creators and brands turn raw footage into cinematic stories that captivate
                audiences and drive results.
              </p>
              <p className="font-body text-mid-gray leading-relaxed">
                With expertise in Adobe Premiere Pro, After Effects, DaVinci Resolve, and more,
                I bring a unique blend of technical skill and creative storytelling to every project.
              </p>
              <p className="font-handwritten text-orange text-lg mt-4 -rotate-1">
                ↳ "why I started — passion for visual storytelling"
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-dark py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="font-handwritten text-lg text-orange mb-2">my skills</p>
              <h2 className="font-heading font-extrabold text-4xl text-off-white">Tools & Proficiency</h2>
            </div>
          </ScrollReveal>

          <div className="max-w-2xl mx-auto space-y-6">
            {skills.map((skill, i) => (
              <ScrollReveal key={skill.name} delay={i * 0.1}>
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-semibold text-off-white text-sm">{skill.name}</span>
                    <span className="font-mono text-xs text-orange opacity-0 group-hover:opacity-100 transition-opacity">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-dark-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-dark to-orange rounded-full animate-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="section-light py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="font-handwritten text-lg text-orange mb-2">my journey</p>
              <h2 className="font-heading font-extrabold text-4xl text-deep-black">Experience</h2>
            </div>
          </ScrollReveal>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-orange/30 -translate-x-1/2" />

            {timeline.map((item, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.2}>
                <div className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} mb-12`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-orange rounded-full -translate-x-1/2 border-4 border-off-white z-10" />
                  {/* Card */}
                  <div className={`ml-12 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:w-1/2" : "md:pl-12 md:w-1/2 md:ml-auto"}`}>
                    <div className="bg-primary-foreground rounded-xl p-6 shadow-md border border-light-gray">
                      <span className="font-mono text-xs text-orange">{item.period}</span>
                      <h3 className="font-heading font-bold text-lg text-deep-black mt-1">{item.role}</h3>
                      <p className="font-heading font-semibold text-sm text-mid-gray">{item.company}</p>
                      <p className="font-body text-sm text-mid-gray mt-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Values */}
      <section className="section-dark py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-6xl text-off-white tracking-wider mb-4">
                "EDITING IS{" "}
                <span className="highlight-word">STORYTELLING</span>"
              </h2>
              <p className="font-body text-mid-gray max-w-lg mx-auto">
                I believe every frame should move the narrative forward. Great editing is invisible — it serves the story.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
            {values.map((value, i) => (
              <StaggerItem key={i}>
                <div className="text-center p-8 rounded-xl border border-dark-gray hover:border-orange transition-colors">
                  <span className="text-4xl mb-4 block">{value.icon}</span>
                  <h3 className="font-heading font-bold text-xl text-off-white mb-2">{value.title}</h3>
                  <p className="font-body text-sm text-mid-gray">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
};

export default About;
