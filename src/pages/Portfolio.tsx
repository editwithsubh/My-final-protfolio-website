import React, { useState, useEffect } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getYouTubeThumbnail } from "@/lib/youtube";
import VideoModal from "@/components/video/VideoModal";

const CATEGORIES = ['All', 'YouTube', 'Short-Form', 'Motion Graphics', 'Ads & Commercials', 'Color Grading', 'Brand Films'];

const Portfolio = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load portfolio videos.');
      } else if (data) {
        setVideos(data);
      }
      setLoading(false);
    };

    fetchVideos();
    return () => { isMounted = false; };
  }, []);

  const filteredVideos = activeCategory === "All" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <p className="font-handwritten text-xl text-orange mb-2">my work</p>
            <h1 className="font-display text-6xl md:text-8xl text-off-white tracking-wider">PORTFOLIO</h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg">
              A curated collection of my best projects, presentations, and tutorials.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-deep-black/90 backdrop-blur-lg border-b border-dark-gray">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 flex gap-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-heading font-semibold whitespace-nowrap transition-all duration-200 ${
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

      {/* Project grid */}
      <section className="section-dark py-16 min-h-[50vh]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          {loading ? (
            <div className="text-center text-mid-gray py-20">Loading portfolio...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-20">{error}</div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center text-mid-gray py-20">
              No videos found for this category.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
              {filteredVideos.map((project, i) => (
                <StaggerItem key={project.id || i}>
                  <div 
                    className="group cursor-pointer"
                    onClick={() => setSelectedVideo(project.video_id)}
                  >
                    <div className="relative aspect-video bg-near-black rounded-xl overflow-hidden border border-dark-gray">
                      <img 
                        src={getYouTubeThumbnail(project.video_id)} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-deep-black/60 backdrop-blur-[2px]">
                        <div className="bg-orange/90 p-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Play size={32} className="text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 px-3 py-1 bg-deep-black/80 backdrop-blur border border-dark-gray text-off-white text-xs font-mono uppercase rounded">
                        {project.category}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </div>
                    <div className="mt-4 px-1">
                      <h3 className="font-heading font-bold text-off-white group-hover:text-orange transition-colors text-lg line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm font-body text-mid-gray mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={!!selectedVideo} 
        videoId={selectedVideo || ''} 
        onClose={() => setSelectedVideo(null)} 
      />
    </>
  );
};

export default Portfolio;
