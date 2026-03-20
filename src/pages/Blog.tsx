import { useEffect, useState } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Simple utility to strip HTML and truncate for excerpts
const extractExcerpt = (htmlContent: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = htmlContent;
  const text = tmp.textContent || tmp.innerText || "";
  return text.substring(0, 150) + "...";
};

const getReadTime = (htmlContent: string) => {
  const words = htmlContent.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return `${time} min`;
};

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <p className="font-handwritten text-xl text-orange mb-2">thoughts & insights</p>
            <h1 className="font-display text-6xl md:text-8xl text-off-white tracking-wider">BLOG</h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg">
              Tips, tutorials, and insights from my latest production learnings.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog grid */}
      <section className="section-light py-16 min-h-[50vh]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading articles...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No blog posts found.</div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
              {posts.map((post, i) => (
                <StaggerItem key={post.id}>
                  <Link to={`/blog/${post.slug}`} className="group h-full flex flex-col">
                    {/* Thumbnail placeholder */}
                    <div className="aspect-video bg-near-black rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 grid-paper opacity-10" />
                      {post.is_paid && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase rounded z-10">
                          Premium
                        </span>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-off-white/70 text-xs font-mono">
                        <Clock size={12} /> {getReadTime(post.content || "")}
                      </div>
                    </div>
                    <div className="mt-4 flex-1 flex flex-col">
                      <h3 className="font-heading font-bold text-base text-deep-black group-hover:text-orange transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-body text-sm text-mid-gray mt-2 leading-relaxed flex-1">
                        {extractExcerpt(post.content || "")}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-orange text-sm font-heading font-semibold group-hover:gap-2 transition-all">
                        Read Article <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
