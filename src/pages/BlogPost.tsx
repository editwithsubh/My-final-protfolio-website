import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { checkAccess } from "@/lib/access";
import { Paywall } from "@/components/ui/paywall";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

    setPost(data);
    const access = await checkAccess(user, data);
    setHasAccess(access);
    setLoading(false);
  };

  if (notFound) return <Navigate to="/blog" replace />;
  
  if (loading) return (
    <div className="min-h-screen pt-32 flex justify-center text-gray-500">
      Loading article...
    </div>
  );

  return (
    <main className="min-h-screen bg-deep-black text-off-white pb-24">
      {/* Blog Header */}
      <article className="max-w-3xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-off-white tracking-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between border-y border-dark-gray py-4 mb-10 text-mid-gray font-mono text-sm">
          <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
          <div className="flex gap-3">
            {post.is_paid && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${hasAccess ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {hasAccess ? '✓ PURCHASED' : 'PREMIUM'}
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          <div 
            className={`prose prose-invert prose-orange max-w-none ${!hasAccess ? 'max-h-[500px] overflow-hidden' : ''}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={!hasAccess ? {
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
            } : undefined}
          />
          
          {/* Blur & Paywall Extender */}
          {!hasAccess && (
            <div className="relative w-full flex justify-center mt-4">
              <Paywall 
                price={post.price} 
                resourceId={post.id} 
                onUnlocked={() => setHasAccess(true)} 
              />
            </div>
          )}
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
