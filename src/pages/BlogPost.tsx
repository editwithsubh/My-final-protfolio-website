import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { checkAccess, type AccessResult } from "@/lib/access";
import { Paywall } from "@/components/ui/paywall";
import { format } from "date-fns";
import { ArrowRight, Clock, Mail, Twitter, Linkedin, Instagram, ArrowLeft, Share2, Copy, Check } from "lucide-react";

const extractExcerpt = (htmlContent: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = htmlContent;
  const text = tmp.textContent || tmp.innerText || "";
  return text.substring(0, 150) + "...";
};

const getReadTime = (htmlContent: string) => {
  const plainText = htmlContent.replace(/<[^>]+>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hasAccess, setHasAccess] = useState<AccessResult>(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const accessGranted = hasAccess === true;
  const accessError = hasAccess === 'error';

  useEffect(() => {
    fetchPost();
  }, [slug, user]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Block draft posts from public viewing
    if (data.status === 'draft') {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setPost(data);
    const access = await checkAccess(user, data, 'blog');
    setHasAccess(access);

    // Fetch related posts (same category, excluding current)
    const { data: related } = await supabase
      .from("blogs")
      .select("id, title, slug, cover_image, category, created_at, content")
      .eq("status", "published")
      .eq("category", data.category || "General")
      .neq("id", data.id)
      .order("created_at", { ascending: false })
      .limit(3);
    setRelatedPosts(related || []);

    // Fetch top posts for sidebar
    const { data: top } = await supabase
      .from("blogs")
      .select("id, title, slug, created_at")
      .eq("status", "published")
      .neq("id", data.id)
      .order("created_at", { ascending: false })
      .limit(5);
    setTopPosts(top || []);

    // Fetch unique categories
    const { data: allBlogs } = await supabase
      .from("blogs")
      .select("category")
      .eq("status", "published");
    const cats = Array.from(new Set((allBlogs || []).map(b => b.category).filter(Boolean)));
    setCategories(cats as string[]);

    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (notFound) return <Navigate to="/blog" replace />;
  
  if (loading || authLoading) return (
    <div className="min-h-screen bg-deep-black pt-32 flex justify-center text-mid-gray font-mono">
      Loading article...
    </div>
  );

  const readTime = getReadTime(post.content || '');

  return (
    <main className="min-h-screen bg-deep-black text-off-white">
      {/* ── HERO BANNER ── */}
      <section className="relative pt-28 pb-16 md:pb-20 overflow-hidden">
        {/* Background cover image with overlay */}
        {post.cover_image && (
          <div className="absolute inset-0 z-0">
            <img src={post.cover_image} alt="" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-black/60 via-deep-black/80 to-deep-black" />
          </div>
        )}
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-mid-gray hover:text-orange transition-colors text-sm font-mono mb-8">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-orange text-white text-xs font-mono font-bold uppercase rounded">
              {post.category || 'General'}
            </span>
            {post.is_paid && (
              <span className={`px-3 py-1 rounded text-xs font-bold ${
                accessGranted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {accessGranted ? '✓ PURCHASED' : accessError ? 'VERIFY ERROR' : 'PREMIUM'}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-off-white tracking-tight leading-tight max-w-4xl mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-mid-gray font-mono text-sm">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center text-orange font-bold text-xs">S</div>
              Shubham Sharma
            </span>
            <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {readTime} min read</span>
          </div>
        </div>
      </section>

      {/* ── 70/30 SPLIT LAYOUT ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── LEFT COLUMN (70%) ── */}
          <article className="w-full lg:w-[70%] relative">
            {/* Floating Social Bar (Desktop only) */}
            <div className="hidden xl:flex flex-col gap-3 fixed left-[max(1rem,calc((100vw-1200px)/2-4rem))] top-1/2 -translate-y-1/2 z-40">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:border-orange transition-all"
              >
                <Twitter size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:border-orange transition-all"
              >
                <Linkedin size={16} />
              </a>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:border-orange transition-all"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="aspect-video rounded-xl overflow-hidden border border-dark-gray mb-10">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Main Content */}
            <div className="relative">
              <div 
                className={`prose prose-invert prose-orange max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-mid-gray prose-p:leading-relaxed prose-a:text-orange prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-off-white ${!accessGranted && post.is_paid ? 'max-h-[500px] overflow-hidden' : ''}`}
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={!accessGranted && post.is_paid ? {
                  maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                } : undefined}
              />
              
              {/* Paywall */}
              {!accessGranted && post.is_paid && (
                <div className="relative w-full flex justify-center mt-4">
                  <Paywall 
                    price={post.price} 
                    currency={post.currency}
                    contentId={post.id}
                    contentType="blog"
                    onUnlocked={() => setHasAccess(true)} 
                  />
                </div>
              )}
            </div>

            {/* ── IN-POST CTA ── */}
            {accessGranted && (
              <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-orange/10 via-near-black to-near-black border border-orange/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange/10 rounded-full blur-3xl" />
                <h3 className="text-2xl font-heading font-bold text-off-white mb-3 relative z-10">Enjoyed this article?</h3>
                <p className="text-mid-gray mb-6 relative z-10">Get more exclusive content, editing tips, and behind-the-scenes breakdowns delivered to your inbox.</p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-heading font-bold rounded-lg hover:bg-orange-dark transition-colors relative z-10"
                >
                  <Mail size={16} /> Get in Touch
                </Link>
              </div>
            )}

            {/* ── AUTHOR BOX ── */}
            <div className="mt-16 p-8 rounded-2xl bg-near-black border border-dark-gray flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-orange/20 border-2 border-orange/40 flex items-center justify-center text-orange font-display text-2xl flex-shrink-0">
                S
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-off-white mb-1">Shubham Sharma</h4>
                <p className="text-orange text-sm font-mono mb-3">Video Editor & Motion Graphics Designer</p>
                <p className="text-mid-gray text-sm leading-relaxed">Self-taught creative specializing in cinematic editing, motion graphics, and visual storytelling. Passionate about transforming raw footage into compelling narratives.</p>
                <div className="flex gap-3 mt-4">
                  <a href="https://x.com/editxshub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:bg-dark-gray/60 transition-all">
                    <Twitter size={14} />
                  </a>
                  <a href="https://www.linkedin.com/in/editxsubh/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:bg-dark-gray/60 transition-all">
                    <Linkedin size={14} />
                  </a>
                  <a href="https://www.instagram.com/editwithshub/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:bg-dark-gray/60 transition-all">
                    <Instagram size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* ── RELATED POSTS ── */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xl font-heading font-bold text-off-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-[3px] bg-orange rounded-full"></span>
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="group block">
                      <div className="aspect-video bg-near-black rounded-lg overflow-hidden border border-dark-gray mb-3">
                        {rp.cover_image ? (
                          <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-dark-gray font-mono text-xs">No Image</div>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-off-white group-hover:text-orange transition-colors line-clamp-2">{rp.title}</h4>
                      <span className="text-xs text-mid-gray font-mono mt-1 block">{rp.created_at ? format(new Date(rp.created_at), "MMM d, yyyy") : ''}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── MOBILE SHARE BAR ── */}
            <div className="flex xl:hidden items-center gap-3 mt-12 pt-8 border-t border-dark-gray">
              <span className="text-mid-gray text-sm font-mono mr-2"><Share2 size={14} className="inline mr-1" />Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange transition-all"
              >
                <Twitter size={14} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange transition-all"
              >
                <Linkedin size={14} />
              </a>
              <button
                onClick={handleCopyLink}
                className="w-9 h-9 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange transition-all"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </article>

          {/* ── RIGHT COLUMN (30% - CONVERSION SIDEBAR) ── */}
          <aside className="w-full lg:w-[30%]">
            <div className="lg:sticky lg:top-24 space-y-8">

              {/* About Widget */}
              <div className="p-6 rounded-2xl bg-near-black border border-dark-gray relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange/10 rounded-full blur-2xl" />
                <h4 className="font-heading font-bold text-off-white mb-2 relative z-10">Say Hello!</h4>
                <p className="text-mid-gray text-sm leading-relaxed mb-4 relative z-10">
                  I'm Shubham, a video editor & motion graphics designer. Looking for creative collaboration?
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange text-white text-sm font-heading font-bold rounded-lg hover:bg-orange-dark transition-colors relative z-10">
                  <Mail size={14} /> Say Hello
                </Link>
              </div>

              {/* Email Subscription */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-orange/5 to-near-black border border-orange/20">
                <h4 className="font-heading font-bold text-off-white mb-2">Stay Updated</h4>
                <p className="text-mid-gray text-xs mb-4">Get the latest editing tips and production insights.</p>
                <a 
                  href="mailto:shubhams6068@gmail.com?subject=Subscribe%20to%20updates" 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-heading font-bold rounded-lg hover:bg-orange-dark transition-colors"
                >
                  <Mail size={14} /> Subscribe via Email
                </a>
              </div>

              {/* Top Articles */}
              {topPosts.length > 0 && (
                <div className="p-6 rounded-2xl bg-near-black border border-dark-gray">
                  <h4 className="font-heading font-bold text-off-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-[3px] bg-orange rounded-full"></span>
                    Top Articles
                  </h4>
                  <div className="space-y-4">
                    {topPosts.map((tp, i) => (
                      <Link key={tp.id} to={`/blog/${tp.slug}`} className="flex gap-3 group items-start">
                        <span className="text-orange font-mono text-xs font-bold mt-0.5 flex-shrink-0">0{i + 1}</span>
                        <div>
                          <h5 className="text-sm font-medium text-off-white group-hover:text-orange transition-colors line-clamp-2 leading-snug">{tp.title}</h5>
                          <span className="text-xs text-mid-gray font-mono">{tp.created_at ? format(new Date(tp.created_at), "MMM d") : ''}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div className="p-6 rounded-2xl bg-near-black border border-dark-gray">
                  <h4 className="font-heading font-bold text-off-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-[3px] bg-orange rounded-full"></span>
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <Link key={cat} to="/blog" className="px-3 py-1.5 bg-dark-gray/50 text-mid-gray text-xs font-mono rounded-full hover:bg-orange/20 hover:text-orange transition-all border border-dark-gray">
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="p-6 rounded-2xl bg-near-black border border-dark-gray">
                <h4 className="font-heading font-bold text-off-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-[3px] bg-orange rounded-full"></span>
                  Connect
                </h4>
                <div className="flex gap-3">
                  <a href="https://x.com/editxshub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-dark-gray/50 border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:border-orange transition-all"><Twitter size={16} /></a>
                  <a href="https://www.linkedin.com/in/editxsubh/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-dark-gray/50 border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:border-orange transition-all"><Linkedin size={16} /></a>
                  <a href="https://www.instagram.com/editwithshub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-dark-gray/50 border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange hover:border-orange transition-all"><Instagram size={16} /></a>
                </div>
              </div>

              {/* Sticky CTA Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange/20 via-orange/10 to-near-black border border-orange/30 text-center">
                <p className="font-heading font-bold text-off-white text-lg mb-2">Need a Video Editor?</p>
                <p className="text-mid-gray text-xs mb-4">Premium editing, motion graphics, and color grading services.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-heading font-bold text-sm rounded-lg hover:bg-orange-dark transition-colors">
                  Hire Me <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BlogPost;
