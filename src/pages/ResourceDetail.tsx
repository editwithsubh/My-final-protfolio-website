import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { checkAccess } from "@/lib/access";
import { Paywall } from "@/components/ui/paywall";
import { ArrowLeft, Download, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [resource, setResource] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
    const access = await checkAccess(user, data);
    setHasAccess(access);
    setLoading(false);
  };

  if (notFound) return <Navigate to="/resources" replace />;
  
  if (loading) return (
    <div className="min-h-screen pt-32 flex justify-center text-gray-500 bg-deep-black">
      Loading resource details...
    </div>
  );

  return (
    <main className="min-h-screen bg-deep-black text-off-white pb-24">
      <article className="max-w-4xl mx-auto px-6 pt-32">
        <Link to="/resources" className="text-mid-gray hover:text-orange mb-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors">
          <ArrowLeft size={16} /> Back to Library
        </Link>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Metadata Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="bg-near-black border border-dark-gray p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="text-orange text-xs font-mono font-bold uppercase mb-2">
                {resource.type}
              </div>
              <h1 className="text-2xl font-heading font-bold mb-4 text-off-white">
                {resource.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {resource.is_paid && (
                  <span className={`px-2 py-1 rounded text-xs font-bold ${hasAccess ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                    {hasAccess ? '✓ OWNED' : 'PREMIUM'}
                  </span>
                )}
              </div>

              {/* Action Buttons if Access Granted */}
              {hasAccess && resource.file_url ? (
                <div className="flex flex-col gap-3">
                  <Button asChild size="lg" className="w-full font-bold gap-2">
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                      {resource.type === 'Video' ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      {resource.type === 'Video' ? 'Watch Now' : 'Download File'}
                    </a>
                  </Button>
                </div>
              ) : hasAccess && !resource.file_url ? (
                <div className="text-sm text-mid-gray italic">No external file associated with this resource.</div>
              ) : null}
            </div>
          </div>

          {/* Content Main Area */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-heading font-bold mb-4">About this Resource</h2>
            {!hasAccess && resource.is_paid ? (
              <div className="mt-8">
                <Paywall 
                  price={resource.price} 
                  resourceId={resource.id} 
                  onUnlocked={() => setHasAccess(true)} 
                />
              </div>
            ) : (
              <div 
                className="prose prose-invert prose-orange max-w-none text-mid-gray"
                dangerouslySetInnerHTML={{ __html: resource.description || "No description provided." }}
              />
            )}
            
            {hasAccess && resource.content && (
              <div className="mt-12 pt-12 border-t border-dark-gray">
                 <h2 className="text-xl font-heading font-bold mb-6 text-white">Resource Content</h2>
                 <div 
                  className="prose prose-invert prose-orange max-w-none bg-near-black p-6 rounded-xl border border-dark-gray"
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
};

export default ResourceDetail;
