import { useState } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { ArrowRight, Download, ShoppingBag } from "lucide-react";

const categories = ["All", "Free Assets", "Editing Guides", "AI Tools", "Creator Workflows", "Editing Templates", "Guides", "Creator Toolkits"];

const resources = [
  // Free resources
  { title: "Free Cinematic LUTs Pack", category: "Free Assets", description: "10 professional color grading LUTs for Premiere Pro and DaVinci Resolve.", type: "Download", price: null, tag: "" },
  { title: "YouTube Editing Workflow 2026", category: "Editing Guides", description: "Step-by-step guide to my complete editing workflow from import to export.", type: "Guide", price: null, tag: "" },
  { title: "Top 15 AI Tools for Video Editors", category: "AI Tools", description: "A curated list of AI-powered tools that will speed up your editing workflow.", type: "Article", price: null, tag: "" },
  { title: "After Effect Templates — Trending Pack", category: "Free Assets", description: "20+ trending After Effect templates for Instagram Reels and YouTube Shorts.", type: "Download", price: null, tag: "" },
  { title: "Short-Form Content Strategy Guide", category: "Creator Workflows", description: "How to plan, edit, and optimize short-form content that goes viral.", type: "Guide", price: null, tag: "" },
  { title: "Premiere Pro Keyboard Shortcuts", category: "Editing Guides", description: "My custom keyboard shortcut layout for maximum editing speed.", type: "Download", price: null, tag: "" },
  { title: "AI Voiceover Tools Comparison", category: "AI Tools", description: "Comparing the best AI voiceover tools for YouTube creators.", type: "Article", price: null, tag: "" },
  { title: "Sound Effects Pack — Free", category: "Free Assets", description: "50+ royalty-free sound effects for transitions, whooshes, and impacts.", type: "Download", price: null, tag: "" },
  // Paid products
  { title: "Cinematic LUT Bundle Pro", category: "Editing Templates", description: "25 premium cinematic LUTs for Premiere Pro, DaVinci Resolve, and Final Cut.", type: "Download", price: "₹499", tag: "Best Seller" },
  { title: "Premiere Pro Transitions Pack", category: "Editing Templates", description: "50+ smooth transitions including glitch, zoom, spin, and cinematic wipes.", type: "Download", price: "₹799", tag: "New" },
  { title: "YouTube Intro Templates", category: "Editing Templates", description: "10 customizable After Effects intro templates for YouTube channels.", type: "Download", price: "₹299", tag: "" },
  { title: "Social Media Editor Toolkit", category: "Creator Toolkits", description: "Complete toolkit with templates, overlays, transitions, and sound effects for Reels/Shorts.", type: "Download", price: "₹999", tag: "Popular" },
  { title: "Color Grading Masterclass Notes", category: "Guides", description: "Comprehensive guide to color grading theory and practical techniques.", type: "Guide", price: "₹199", tag: "" },
  { title: "Motion Graphics Starter Kit", category: "Creator Toolkits", description: "Lower thirds, call-outs, subscribe buttons, and animated elements.", type: "Download", price: "₹599", tag: "" },
];

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const filtered = resources.filter((r) => {
    const catMatch = activeCategory === "All" || r.category === activeCategory;
    const priceMatch =
      priceFilter === "all" ||
      (priceFilter === "free" && !r.price) ||
      (priceFilter === "paid" && !!r.price);
    return catMatch && priceMatch;
  });

  return (
    <>
      {/* Hero */}
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <p className="font-handwritten text-xl text-orange mb-2">resources & shop</p>
            <h1 className="font-display text-6xl md:text-8xl text-off-white tracking-wider">RESOURCES</h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg">
              Free guides, templates, and premium toolkits to level up your video editing game.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 md:top-20 z-30 bg-deep-black/90 backdrop-blur-lg border-b border-dark-gray">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 space-y-3">
          {/* Price toggle */}
          <div className="flex gap-2">
            {(["all", "free", "paid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPriceFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                  priceFilter === f
                    ? "bg-orange text-primary-foreground"
                    : "border border-dark-gray text-mid-gray hover:border-orange hover:text-orange"
                }`}
              >
                {f === "all" ? "All" : f === "free" ? "Free" : "Paid"}
              </button>
            ))}
          </div>
          {/* Category pills */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-heading font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-orange text-primary-foreground"
                    : "border border-dark-gray text-mid-gray hover:border-orange hover:text-orange"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section-dark py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.08}>
            {filtered.map((resource, i) => (
              <StaggerItem key={i}>
                <div className="group bg-near-black rounded-xl overflow-hidden border border-dark-gray hover:-translate-y-1 hover:shadow-lg hover:shadow-orange/10 transition-all duration-300 h-full flex flex-col">
                  {/* Tag / Price badge */}
                  {(resource.tag || resource.price) && (
                    <div className="flex items-center gap-2 px-6 pt-4">
                      {resource.tag && (
                        <span className="px-3 py-1 bg-orange text-primary-foreground text-xs font-mono uppercase rounded-full">
                          {resource.tag}
                        </span>
                      )}
                      {resource.price && (
                        <span className="px-3 py-1 bg-near-black border border-orange text-orange text-xs font-mono rounded-full">
                          {resource.price}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="font-handwritten text-sm text-orange">{resource.category}</span>
                    <h3 className="font-heading font-bold text-base text-off-white mt-2 mb-3 group-hover:text-orange transition-colors">
                      {resource.title}
                    </h3>
                    <p className="font-body text-sm text-mid-gray leading-relaxed flex-1">{resource.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange text-sm font-heading font-semibold">
                        {resource.price ? <ShoppingBag size={14} /> : <Download size={14} />}
                        {resource.price ? "Buy Now" : resource.type === "Download" ? "Download Free" : "Read More"}
                      </div>
                      {resource.price && (
                        <span className="font-display text-2xl text-orange">{resource.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <p className="text-center text-mid-gray font-body py-12">No resources found for this filter.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Resources;
