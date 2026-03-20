import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const categories = ["All", "YouTube", "Social Media", "Motion Graphics", "Ads"];

const projects = [
  { title: "Brand Story — Luxury Fashion Campaign", category: "YouTube", client: "Fashion House", duration: "8 min" },
  { title: "Product Launch — SaaS Platform", category: "Ads", client: "TechCo", duration: "45 sec" },
  { title: "Animated Logo Reveal", category: "Motion Graphics", client: "Studio X", duration: "15 sec" },
  { title: "Travel Vlog Series — Rajasthan", category: "YouTube", client: "Travel Creator", duration: "12 min" },
  { title: "Instagram Reels Pack", category: "Social Media", client: "D2C Brand", duration: "30 sec" },
  { title: "Motion Graphics Reel 2025", category: "Motion Graphics", client: "Personal", duration: "2 min" },
  { title: "YouTube Shorts — Tech Reviews", category: "Social Media", client: "Tech Creator", duration: "60 sec" },
  { title: "Corporate Brand Film", category: "Ads", client: "Enterprise Co", duration: "3 min" },
  { title: "Animated Explainer Video", category: "Motion Graphics", client: "EdTech", duration: "90 sec" },
];

const Portfolio = () => {
  return (
    <>
      {/* Hero */}
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <p className="font-handwritten text-xl text-orange mb-2">my work</p>
            <h1 className="font-display text-6xl md:text-8xl text-off-white tracking-wider">PORTFOLIO</h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg">
              A curated collection of my best video editing, motion graphics, and commercial projects.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-deep-black/90 backdrop-blur-lg border-b border-dark-gray">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 flex gap-3 overflow-x-auto">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-heading font-semibold whitespace-nowrap transition-all duration-200 ${
                i === 0
                  ? "bg-orange text-primary-foreground"
                  : "border border-dark-gray text-mid-gray hover:border-orange hover:text-orange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <section className="section-dark py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {projects.map((project, i) => (
              <StaggerItem key={i}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-video bg-near-black rounded-xl overflow-hidden border border-dark-gray">
                    <div className="absolute inset-0 grid-paper opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-deep-black/60">
                      <Play size={48} className="text-orange" />
                    </div>
                    <span className="absolute top-3 left-3 px-3 py-1 bg-orange text-primary-foreground text-xs font-mono uppercase rounded">
                      {project.category}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading font-bold text-off-white group-hover:text-orange transition-colors text-sm">
                      {project.title}
                    </h3>
                    <div className="flex gap-4 mt-1 text-xs font-mono text-mid-gray">
                      <span>{project.client}</span>
                      <span>{project.duration}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
};

export default Portfolio;
