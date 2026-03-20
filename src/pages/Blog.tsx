import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

const categories = [
  { label: "All", color: "bg-orange" },
  { label: "Editing Tips", color: "bg-orange-light" },
  { label: "AI Tools", color: "bg-yellow-highlight" },
  { label: "Workflows", color: "bg-orange-dark" },
  { label: "Industry", color: "bg-mid-gray" },
];

const posts = [
  { title: "10 Best AI Tools Every Video Editor Needs in 2026", category: "AI Tools", readTime: "6 min", excerpt: "Discover the AI-powered tools that are revolutionizing video editing workflows and saving editors hours per project." },
  { title: "How to Edit Viral YouTube Videos: A Complete Guide", category: "Editing Tips", readTime: "8 min", excerpt: "Learn the pacing, storytelling, and hook techniques that make YouTube videos go viral." },
  { title: "My Complete Editing Workflow for YouTube Creators", category: "Workflows", readTime: "10 min", excerpt: "A step-by-step breakdown of my editing process from receiving raw footage to final export." },
  { title: "Short-Form Content: Editing Strategies That Work", category: "Editing Tips", readTime: "5 min", excerpt: "Master the art of editing Instagram Reels, YouTube Shorts, and TikTok videos." },
  { title: "The Future of AI in Video Production", category: "AI Tools", readTime: "7 min", excerpt: "How AI is changing the landscape of video production and what it means for editors." },
  { title: "Color Grading 101: From Flat to Cinematic", category: "Editing Tips", readTime: "9 min", excerpt: "A beginner-friendly guide to color grading that will transform your footage." },
];

const Blog = () => {
  return (
    <>
      {/* Hero */}
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <p className="font-handwritten text-xl text-orange mb-2">thoughts & insights</p>
            <h1 className="font-display text-6xl md:text-8xl text-off-white tracking-wider">BLOG</h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg">
              Tips, tutorials, and insights on video editing, motion graphics, and the creator economy.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-16 md:top-20 z-30 bg-deep-black/90 backdrop-blur-lg border-b border-dark-gray">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 flex gap-3 overflow-x-auto">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              className={`px-5 py-2 rounded-full text-sm font-heading font-semibold whitespace-nowrap transition-all ${
                i === 0 ? "bg-orange text-primary-foreground" : "border border-dark-gray text-mid-gray hover:border-orange hover:text-orange"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog grid */}
      <section className="section-light py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {posts.map((post, i) => (
              <StaggerItem key={i}>
                <div className="group cursor-pointer h-full flex flex-col">
                  {/* Thumbnail placeholder */}
                  <div className="aspect-video bg-near-black rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 grid-paper opacity-10" />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-orange text-primary-foreground text-xs font-mono uppercase rounded">
                      {post.category}
                    </span>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-off-white/70 text-xs font-mono">
                      <Clock size={12} /> {post.readTime}
                    </div>
                  </div>
                  <div className="mt-4 flex-1 flex flex-col">
                    <h3 className="font-heading font-bold text-base text-deep-black group-hover:text-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-mid-gray mt-2 leading-relaxed flex-1">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-orange text-sm font-heading font-semibold group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={14} />
                    </span>
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

export default Blog;
