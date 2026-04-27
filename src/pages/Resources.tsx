import { useState, useEffect } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { ArrowRight, Download, ShoppingBag, Pickaxe, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/pricing";

const extractExcerpt = (htmlContent: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = htmlContent || "";
  return (tmp.textContent || tmp.innerText || "").substring(0, 120) + "...";
};

const getReadTime = (htmlContent: string) => {
  const plainText = htmlContent.replace(/<[^>]+>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const time = Math.max(1, Math.ceil(words / 200));
  return `${time} min`;
};

const Resources = () => {
  const [activeTab, setActiveTab] = useState<"resources" | "blogs">("resources");
  const [resources, setResources] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resResponse, blogResponse] = await Promise.all([
          supabase.from("resources").select("*").order("created_at", { ascending: false }),
          supabase.from("blogs").select("*").order("created_at", { ascending: false })
        ]);

        if (!isMounted) return;

        if (resResponse.error) throw resResponse.error;
        if (blogResponse.error) throw blogResponse.error;

        setResources((resResponse.data || []).filter((r) => !r.status || r.status === 'published'));
        setBlogs((blogResponse.data || []).filter((b) => !b.status || b.status === 'published'));
      } catch (err: any) {
        console.error('Error fetching vault data:', err);
        setError('Failed to load vault. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-off-white text-deep-black font-body overflow-x-hidden min-h-screen">
      
      {/* Brutalist Header */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-10 sm:mb-12">
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-[clamp(2.5rem,12vw,6rem)] lg:text-8xl text-deep-black uppercase tracking-tight mb-6 break-words leading-[0.9] md:leading-none">
                  THE <span className="bg-brutal-yellow px-3 sm:px-4 border-2 border-deep-black shadow-[4px_4px_0px_#111] inline-block -rotate-2">VAULT</span>
                </h1>
                <p className="font-mono font-bold text-sm md:text-base text-deep-black max-w-lg border-l-4 border-brutal-yellow pl-4 bg-white p-4 border-y-2 border-r-2 border-deep-black shadow-[4px_4px_0px_#111]">
                  A curated hub of premium editing resources, free presets, project files, and detailed production case studies.
                </p>
              </div>
              <div className="hidden md:flex flex-col items-center lg:items-end shrink-0 pt-2 lg:pt-6 text-mid-gray opacity-85 pointer-events-none">
                <span className="font-handwritten text-lg lg:text-xl text-mid-gray -rotate-6 text-center lg:text-right max-w-[10rem] leading-tight">Freebies &amp; Logs</span>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mt-1 lg:ml-4 rotate-12 shrink-0" aria-hidden>
                   <path d="M2.5 3.5C12.5 6.5 35 15 32 35" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                   <path d="M25 30L32 35L38 28" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* Tab Switcher - Blueprint Style */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 border-b-2 border-deep-black pb-4">
              <button
                onClick={() => setActiveTab("resources")}
                className={`flex-1 text-center font-mono text-sm font-bold uppercase px-6 py-4 border-2 border-deep-black transition-all ${
                  activeTab === "resources" 
                    ? "bg-brutal-yellow translate-x-1 translate-y-1 shadow-[inset_2px_2px_0px_#fff]" 
                    : "bg-white shadow-[3px_3px_0px_#111] hover:bg-light-gray cursor-pointer hover:-translate-y-1"
                }`}
              >
                [01] Digital Assets
              </button>
              <button
                onClick={() => setActiveTab("blogs")}
                className={`flex-1 text-center font-mono text-sm font-bold uppercase px-6 py-4 border-2 border-deep-black transition-all ${
                  activeTab === "blogs" 
                    ? "bg-[#D8A1FF] translate-x-1 translate-y-1 shadow-[inset_2px_2px_0px_#fff]" 
                    : "bg-white shadow-[3px_3px_0px_#111] hover:bg-light-gray cursor-pointer hover:-translate-y-1"
                }`}
              >
                [02] Production Blogs
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid Content */}
      <section className="pb-20 sm:pb-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          {loading ? (
             <div className="py-24 font-mono font-bold text-center text-lg animate-pulse w-max mx-auto bg-brutal-yellow px-4 border-2 border-deep-black shadow-[4px_4px_0px_#111] rotate-1">
               LOADING DATABANKS...
             </div>
          ) : error ? (
            <div className="font-mono text-center text-white bg-red-600 px-6 py-4 border-2 border-deep-black shadow-[4px_4px_0px_#111] w-max mx-auto rotate-1">
              {error}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.05}>
              
              {/* RESOURCES RENDER */}
              {activeTab === "resources" && resources.map((resource) => (
                <StaggerItem key={`res-${resource.id}`}>
                  <Link 
                    to={`/resources/${resource.id}`}
                    className="group block bg-white border-2 border-deep-black shadow-[6px_6px_0px_#111] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#111] transition-all duration-200 h-full flex flex-col relative"
                  >
                    {/* Washi Tape Accent */}
                    <div className="absolute -top-3 -right-2 w-12 h-5 bg-brutal-yellow border border-deep-black/20 rotate-[15deg] z-20 mix-blend-multiply opacity-80" />

                    <div className="aspect-[4/3] bg-light-gray border-b-2 border-deep-black overflow-hidden relative">
                      {resource.cover_image ? (
                        <img src={resource.cover_image} alt={resource.title} width={400} height={300} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <div className="absolute inset-0 grid-paper opacity-50" />
                      )}
                      
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {resource.badge && (
                          <span className="bg-deep-black text-white px-2 py-0.5 text-[10px] font-mono uppercase border border-deep-black/50">
                            {resource.badge}
                          </span>
                        )}
                      </div>
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-2 right-2 bg-white border-2 border-deep-black px-2 py-1 shadow-[2px_2px_0px_#111]">
                        <span className="font-mono text-[10px] font-black uppercase text-deep-black block leading-none">
                          {resource.is_paid ? 'PREMIUM' : 'FREE'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {resource.type && (
                        <span className="font-handwritten text-orange text-sm mb-1 inline-block -rotate-2 w-max">
                          {resource.type}
                        </span>
                      )}
                      
                      <h3 className="font-heading font-black text-lg text-deep-black uppercase leading-tight mb-2 group-hover:underline decoration-2 underline-offset-2">
                        {resource.title}
                      </h3>
                      
                      <p className="font-body text-sm text-deep-black/70 leading-relaxed flex-1 mb-4">
                        {resource.excerpt || extractExcerpt(resource.description)}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t-2 border-dashed border-deep-black/30 flex items-center justify-between">
                        <div className="font-mono text-[11px] font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                           {resource.is_paid ? 'View Kit' : 'Download via Drive'} <ArrowRight size={12} />
                        </div>
                        {resource.is_paid && (
                          <span className="font-display text-xl text-deep-black tracking-tighter bg-brutal-yellow px-1">{formatPrice(resource.price, resource.currency)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}

              {/* BLOGS RENDER */}
              {activeTab === "blogs" && blogs.map((post) => (
                <StaggerItem key={`blog-${post.id}`}>
                  <Link 
                    to={`/blog/${post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} 
                    className="group block bg-white border-2 border-deep-black shadow-[6px_6px_0px_#111] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#111] transition-all duration-200 h-full flex flex-col relative"
                  >
                    {/* Dark Tape Accent */}
                    <div className="absolute -top-3 -left-3 w-16 h-6 bg-deep-black rotate-[-12deg] z-20 border border-white/20" />

                    <div className="aspect-video bg-light-gray border-b-2 border-deep-black overflow-hidden relative">
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} width={640} height={360} loading="lazy" decoding="async" className="w-full h-full object-cover scale-[1.05] grayscale group-hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#D8A1FF]">
                            <BookOpen size={48} className="text-deep-black opacity-20" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-2 left-2 bg-[#D8A1FF] border-2 border-deep-black px-2 py-1 shadow-[2px_2px_0px_#111] flex items-center gap-1">
                        <span className="font-mono text-[10px] font-black uppercase text-deep-black block leading-none">
                          {post.reading_time ? `${post.reading_time} MIN READ` : getReadTime(post.content || '')}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <span className="font-handwritten text-[#D8A1FF] text-sm mb-1 inline-block rotate-2 w-max text-deep-black font-bold">
                        {post.category || 'Opinion'}
                      </span>
                      
                      <h3 className="font-heading font-black text-lg text-deep-black leading-tight mb-2 group-hover:underline decoration-2 underline-offset-2">
                        {post.title}
                      </h3>
                      
                      <p className="font-body text-sm text-deep-black/80 leading-relaxed flex-1">
                        {post.excerpt || extractExcerpt(post.content || '')}
                      </p>
                      
                      <div className="mt-4 font-mono text-[11px] font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all border-t-2 border-deep-black pt-2">
                        Read Entry <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}

              {/* EMPTY STATES */}
              {activeTab === "resources" && resources.length === 0 && (
                <div className="col-span-full py-12 text-center text-deep-black font-mono font-bold opacity-50 bg-light-gray border-2 border-dashed border-deep-black">
                  [ NO DIGITAL ASSETS FOUND ]
                </div>
              )}
              {activeTab === "blogs" && blogs.length === 0 && (
                <div className="col-span-full py-12 text-center text-deep-black font-mono font-bold opacity-50 bg-light-gray border-2 border-dashed border-deep-black">
                  [ NO PRODUCTION LOGS FOUND ]
                </div>
              )}

            </StaggerContainer>
          )}

        </div>
      </section>
    </div>
  );
};

export default Resources;
