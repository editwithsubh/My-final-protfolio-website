import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { checkAccess, type AccessResult } from "@/lib/access";
import { Paywall } from "@/components/ui/paywall";
import { ArrowLeft, Download, ExternalLink, Play, ArrowRight, Mail, Twitter, Linkedin, Instagram, Share2, Copy, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/pricing";
import { toast } from "sonner";
import { format } from "date-fns";

const getStorageObjectPath = (fileUrl: string) => {
  const marker = '/storage/v1/object/public/resources/';
  return fileUrl.includes(marker) ? fileUrl.split(marker)[1] : null;
};

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  
  const [resource, setResource] = useState<any>(null);
  const [relatedResources, setRelatedResources] = useState<any[]>([]);
  const [hasAccess, setHasAccess] = useState<AccessResult>(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const accessGranted = hasAccess === true;
  const accessError = hasAccess === 'error';

  useEffect(() => {
    fetchResource();
  }, [id, user]);

  const fetchResource = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setResource(data);
    const access = await checkAccess(user, data, 'resource');
    setHasAccess(access);

    // Fetch related resources (same type, excluding current)
    const { data: related } = await supabase
      .from("resources")
      .select("id, title, cover_image, type, is_paid, price, currency, created_at, excerpt, description")
      .eq("type", data.type || "File")
      .neq("id", data.id)
      .order("created_at", { ascending: false })
      .limit(3);
    setRelatedResources(related || []);

    setLoading(false);
  };

  const handleAccessFile = async () => {
    if (!resource?.file_url) return;

    const storagePath = getStorageObjectPath(resource.file_url);
    if (!storagePath) {
      window.open(resource.file_url, '_blank', 'noopener,noreferrer');
      return;
    }

    setDownloading(true);
    try {
      const { data, error } = await supabase.storage.from('resources').createSignedUrl(storagePath, 3600);
      if (error || !data?.signedUrl) throw error ?? new Error('Failed to create secure download link.');
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      toast.error(error.message || 'Could not open the file.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (!id) return <Navigate to="/resources" replace />;
  if (notFound) return <Navigate to="/resources" replace />;
  
  if (loading || authLoading) return (
    <div className="min-h-screen pt-32 flex justify-center text-mid-gray bg-deep-black font-mono">
      Loading resource details...
    </div>
  );

  const extractExcerpt = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").substring(0, 120) + "...";
  };

  return (
    <main className="min-h-screen bg-deep-black text-off-white">
      {/* ── HERO BANNER ── */}
      <section className="relative pt-28 pb-16 md:pb-20 overflow-hidden">
        {resource.cover_image && (
          <div className="absolute inset-0 z-0">
            <img src={resource.cover_image} alt="" className="w-full h-full object-cover opacity-15 blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-black/60 via-deep-black/80 to-deep-black" />
          </div>
        )}
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <Link to="/resources" className="inline-flex items-center gap-2 text-mid-gray hover:text-orange transition-colors text-sm font-mono mb-8">
            <ArrowLeft size={14} /> Back to Vault
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-orange text-white text-xs font-mono font-bold uppercase rounded">
              {resource.type}
            </span>
            {resource.badge && (
              <span className="px-3 py-1 bg-deep-black border border-off-white/20 text-off-white text-xs font-mono uppercase rounded">
                {resource.badge}
              </span>
            )}
            {resource.is_paid && (
              <span className={`px-3 py-1 rounded text-xs font-bold ${
                accessGranted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {accessGranted ? '✓ OWNED' : accessError ? 'VERIFY ERROR' : 'PREMIUM'}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-off-white tracking-tight leading-tight max-w-4xl mb-6">
            {resource.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-mid-gray font-mono text-sm">
            {resource.is_paid && (
              <span className="text-orange font-bold text-lg">{formatPrice(resource.price, resource.currency)}</span>
            )}
            {!resource.is_paid && (
              <span className="text-green-400 font-bold">FREE</span>
            )}
            {resource.created_at && (
              <span>{format(new Date(resource.created_at), "MMMM d, yyyy")}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── 70/30 SPLIT LAYOUT ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── LEFT COLUMN (70%) ── */}
          <div className="w-full lg:w-[70%]">
            {/* Cover Image */}
            {resource.cover_image && (
              <div className="aspect-video rounded-xl overflow-hidden border border-dark-gray mb-10">
                <img src={resource.cover_image} alt={resource.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Action Buttons */}
            {accessGranted && resource.file_url && (
              <div className="mb-10 p-6 rounded-2xl bg-near-black border border-dark-gray flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <p className="text-off-white font-heading font-bold mb-1">Ready to download</p>
                  <p className="text-mid-gray text-sm">Your access has been verified. Enjoy!</p>
                </div>
                <Button size="lg" className="font-bold gap-2 bg-orange hover:bg-orange-dark text-white" onClick={handleAccessFile} disabled={downloading}>
                  {resource.type === 'Video' ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {downloading ? 'Preparing...' : resource.type === 'Video' ? 'Watch Now' : 'Download File'}
                </Button>
              </div>
            )}

            {/* Main Description */}
            <div>
              <h2 className="text-xl font-heading font-bold mb-6 text-off-white flex items-center gap-3">
                <span className="w-8 h-[3px] bg-orange rounded-full"></span>
                About this Resource
              </h2>
              {resource.is_paid && !accessGranted ? (
                <div>
                  {accessError && (
                    <div className="mb-4 text-sm text-mid-gray">
                      Could not verify your purchase. Please try again.
                    </div>
                  )}
                  {/* Show a preview of the description then paywall */}
                  <div 
                    className="prose prose-invert prose-orange max-w-none text-mid-gray mb-6 max-h-[200px] overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: resource.description || "No description provided." }}
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                    }}
                  />
                  <Paywall 
                    price={resource.price} 
                    currency={resource.currency}
                    contentId={resource.id}
                    contentType="resource"
                    onUnlocked={() => setHasAccess(true)} 
                  />
                </div>
              ) : (
                <div 
                  className="prose prose-invert prose-orange max-w-none text-mid-gray prose-headings:font-heading prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-orange prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: resource.description || "No description provided." }}
                />
              )}
            </div>
            
            {/* Resource Content (unlocked) */}
            {hasAccess && resource.content && (
              <div className="mt-12 pt-12 border-t border-dark-gray">
                <h2 className="text-xl font-heading font-bold mb-6 text-white flex items-center gap-3">
                  <span className="w-8 h-[3px] bg-orange rounded-full"></span>
                  Resource Content
                </h2>
                <div 
                  className="prose prose-invert prose-orange max-w-none bg-near-black p-6 rounded-xl border border-dark-gray"
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              </div>
            )}

            {/* ── IN-POST CTA ── */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-orange/10 via-near-black to-near-black border border-orange/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange/10 rounded-full blur-3xl" />
              <h3 className="text-2xl font-heading font-bold text-off-white mb-3 relative z-10">Want more resources?</h3>
              <p className="text-mid-gray mb-6 relative z-10">Explore the vault for more premium presets, project files, and production guides.</p>
              <Link 
                to="/resources" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-heading font-bold rounded-lg hover:bg-orange-dark transition-colors relative z-10"
              >
                Browse the Vault <ArrowRight size={14} />
              </Link>
            </div>

            {/* ── RELATED RESOURCES ── */}
            {relatedResources.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xl font-heading font-bold text-off-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-[3px] bg-orange rounded-full"></span>
                  Related Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedResources.map((rr) => (
                    <Link key={rr.id} to={`/resources/${rr.id}`} className="group block">
                      <div className="aspect-[4/3] bg-near-black rounded-lg overflow-hidden border border-dark-gray mb-3">
                        {rr.cover_image ? (
                          <img src={rr.cover_image} alt={rr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-dark-gray font-mono text-xs">No Image</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange text-xs font-mono font-bold">{rr.type}</span>
                        <span className="text-mid-gray text-xs font-mono">{rr.is_paid ? formatPrice(rr.price, rr.currency) : 'FREE'}</span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-off-white group-hover:text-orange transition-colors line-clamp-2">{rr.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── MOBILE SHARE BAR ── */}
            <div className="flex xl:hidden items-center gap-3 mt-12 pt-8 border-t border-dark-gray">
              <span className="text-mid-gray text-sm font-mono mr-2"><Share2 size={14} className="inline mr-1" />Share:</span>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(resource.title)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange transition-all"><Twitter size={14} /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange transition-all"><Linkedin size={14} /></a>
              <button onClick={handleCopyLink} className="w-9 h-9 rounded-full bg-near-black border border-dark-gray flex items-center justify-center text-mid-gray hover:text-orange transition-all">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (30% - CONVERSION SIDEBAR) ── */}
          <aside className="w-full lg:w-[30%]">
            <div className="lg:sticky lg:top-24 space-y-8">

              {/* About Widget */}
              <div className="p-6 rounded-2xl bg-near-black border border-dark-gray relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange/10 rounded-full blur-2xl" />
                <h4 className="font-heading font-bold text-off-white mb-2 relative z-10">Say Hello!</h4>
                <p className="text-mid-gray text-sm leading-relaxed mb-4 relative z-10">
                  I'm Shubham, a video editor & motion graphics designer. Let's collaborate!
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange text-white text-sm font-heading font-bold rounded-lg hover:bg-orange-dark transition-colors relative z-10">
                  <Mail size={14} /> Say Hello
                </Link>
              </div>

              {/* Email Subscription */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-orange/5 to-near-black border border-orange/20">
                <h4 className="font-heading font-bold text-off-white mb-2">Stay Updated</h4>
                <p className="text-mid-gray text-xs mb-4">Get notified when new resources and presets drop.</p>
                <a 
                  href="mailto:shubhams6068@gmail.com?subject=Subscribe%20to%20resource%20updates" 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-heading font-bold rounded-lg hover:bg-orange-dark transition-colors"
                >
                  <Mail size={14} /> Subscribe via Email
                </a>
              </div>

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

export default ResourceDetail;
