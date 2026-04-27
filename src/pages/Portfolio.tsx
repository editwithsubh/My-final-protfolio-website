import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { getYouTubeThumbnail } from "@/lib/youtube";
import VideoModal from "@/components/video/VideoModal";

const CATEGORIES = ['All', 'YouTube', 'Short-Form', 'Motion Graphics', 'Ads & Commercials', 'Color Grading', 'Brand Films'];

const Portfolio = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && CATEGORIES.includes(category)) {
      setActiveCategory(category);
    }
  }, [location.search]);

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
    : videos.filter(v => (v.category || '').split(',').map((c: string) => c.trim()).includes(activeCategory));

  // Separate shorts and longs for the masonry layout
  const shorts = filteredVideos.filter(v => v.video_type === 'short');
  const longs = filteredVideos.filter(v => v.video_type !== 'short');

  const neoCardBase = "relative bg-[#FAFAFA] border-[3px] border-deep-black p-2 group transition-all duration-300 cursor-pointer";
  const neoCardLong = `${neoCardBase} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`;
  const neoCardShort = `${neoCardBase} shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]`;
  
  const PixelPlay = ({ size = "24" }: { size?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4H10V6H12V8H14V10H16V14H14V16H12V18H10V20H8V4Z" fill="currentColor"/>
    </svg>
  );

  const renderVideoCard = (project: any, i: number, isShort: boolean) => (
    <StaggerItem key={project.id || i}>
      <div 
        className={`${isShort ? neoCardShort : neoCardLong} block w-full touch-manipulation ${i % 2 !== 0 ? 'rotate-1' : '-rotate-1'}`}
        onClick={() => setSelectedVideo({ id: project.video_id, type: project.video_type || 'long' })}
      >
        {/* Random Washi Tape overlays per card */}
        {i % 3 === 0 && <div className="absolute -top-3 -left-4 w-20 h-6 bg-orange opacity-90 rotate-[-12deg] z-20 border border-deep-black/20 mix-blend-multiply drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]"></div>}
        {i % 2 === 0 && <div className="absolute -bottom-3 -right-4 w-16 h-5 bg-[#D97757] opacity-90 rotate-[15deg] z-20 border border-deep-black/20 mix-blend-multiply drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]"></div>}

        <div className={`relative ${isShort ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden border-[3px] border-deep-black bg-deep-black mb-3`}>
          <img 
            src={getYouTubeThumbnail(project.video_id)} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity"
            loading="lazy"
          />
          {/* VHS Effects */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white border-2 border-deep-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-1 text-deep-black hover:bg-[#F3C623] transition-colors">
              <PixelPlay size="32" />
            </div>
          </div>
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-300 border-2 border-deep-black text-deep-black font-mono text-[10px] sm:text-xs font-bold uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            {(project.category || '').split(',')[0].trim()}
          </span>
          {isShort && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#D8A1FF] border-2 border-deep-black text-deep-black font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              SHORT
            </span>
          )}
        </div>
        <div className="px-1 relative">
          <h3 className="font-heading font-black text-deep-black leading-tight text-lg md:text-xl line-clamp-2 uppercase">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-sm font-body text-deep-black/80 mt-2 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </div>
    </StaggerItem>
  );

  return (
    <div className="bg-[#EAEAEA] min-h-screen relative overflow-hidden pb-20">
      {/* Graph Paper Background overlay */}
      <div className="absolute inset-0 grid-paper opacity-30 mix-blend-multiply pointer-events-none" />

      {/* Hero */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
             <div className="relative inline-block mb-4">
              <div className="absolute -bottom-1 -left-2 w-[110%] h-[50%] bg-[#D97757] -rotate-1 -z-10 blur-[1px] opacity-80"></div>
              <h1 className="font-display text-6xl md:text-[7rem] text-deep-black tracking-wider uppercase m-0 leading-none">PORTFOLIO</h1>
            </div>
            <p className="font-handwritten text-2xl text-deep-black mt-2 -rotate-2 max-w-lg">
              A curated collection of my best projects, presentations, and tutorials.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#FAFAFA]/90 backdrop-blur-md border-b-4 border-deep-black shadow-[0_4px_0_0_rgba(0,0,0,1)] mb-12">
        <div className="relative">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-6 py-3 min-w-fit border-2 border-deep-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] text-sm font-heading font-black uppercase whitespace-nowrap transition-transform active:translate-y-1 active:shadow-[0px_0px_0_0_rgba(0,0,0,1)] snap-align-start ${
                  activeCategory === cat
                    ? "bg-[#F3C623] text-deep-black translate-y-[2px] shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                    : "bg-white text-deep-black hover:bg-orange"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Project grid */}
      <section className="relative z-10 min-h-[50vh]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          {loading ? (
            <div className="text-center text-deep-black font-body font-bold py-20">Loading portfolio tapes...</div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold py-20">{error}</div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center text-deep-black font-handwritten text-xl py-20">
              Tape not found in this bin.
            </div>
          ) : (
            <>
              {/* Long-form videos: standard 3-column grid */}
              {longs.length > 0 && (
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 pb-16 items-start" staggerDelay={0.05}>
                  {longs.map((project, i) => renderVideoCard(project, i, false))}
                </StaggerContainer>
              )}

              {/* Short-form videos: 4-5 column grid for vertical aspect */}
              {shorts.length > 0 && (
                <>
                  {longs.length > 0 && (
                    <div className="flex items-center gap-4 my-12">
                      <div className="flex-1 h-[3px] bg-deep-black"></div>
                      <span className="font-heading font-black text-deep-black text-lg uppercase tracking-widest bg-[#D8A1FF] border-2 border-deep-black px-4 py-1.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)] -rotate-1">
                        Short-Form
                      </span>
                      <div className="flex-1 h-[3px] bg-deep-black"></div>
                    </div>
                  )}
                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 pb-16 items-start" staggerDelay={0.05}>
                    {shorts.map((project, i) => renderVideoCard(project, i, true))}
                  </StaggerContainer>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={!!selectedVideo} 
        videoId={selectedVideo?.id || ''} 
        videoType={selectedVideo?.type || 'long'}
        onClose={() => setSelectedVideo(null)} 
      />
    </div>
  );
};

export default Portfolio;
