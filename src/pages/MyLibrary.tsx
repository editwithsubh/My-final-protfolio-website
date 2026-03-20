import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Download, Play, Search, Library as LibraryIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";

const MyLibrary = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user]);

  const fetchLibrary = async () => {
    setLoading(true);
    
    // Step 1: Get all purchases for user
    const { data: purchases, error: purchaseError } = await supabase
      .from("purchases")
      .select("resource_id")
      .eq("user_id", user?.id);

    if (purchaseError || !purchases || purchases.length === 0) {
      setResources([]);
      setLoading(false);
      return;
    }

    const resourceIds = purchases.map(p => p.resource_id);

    // Step 2: Fetch corresponding resources
    const { data: resourceData } = await supabase
      .from("resources")
      .select("*")
      .in("id", resourceIds);

    if (resourceData) {
      // Step 3: We can also merge any Blog purchases if blogs are separate.
      // But user requested specifically: "purchases: resource_id, resources: id, title, type..."
      // Assuming all purchases point to 'resources' table. If there are 'blogs', they might be in the same table or we handle them separately.
      setResources(resourceData);
    }

    setLoading(false);
  };

  const categories = ["All", ...Array.from(new Set(resources.map(r => r.type)))];

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || r.type === activeCategory;
      return matchSearch && matchCat;
    });
  }, [resources, search, activeCategory]);

  return (
    <main className="min-h-screen bg-deep-black text-off-white pb-24">
      {/* Header */}
      <section className="pt-32 pb-12 border-b border-dark-gray bg-near-black/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <div className="flex items-center gap-4 text-orange mb-4">
            <div className="p-3 bg-orange/10 rounded-full">
              <LibraryIcon className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl tracking-wider text-off-white">MY LIBRARY</h1>
          </div>
          <p className="font-body text-mid-gray max-w-lg text-lg">
            Access all your purchased premium tutorials, assets, and workflows in one place.
          </p>
        </div>
      </section>

      {/* Dashboard Toolbar */}
      <div className="sticky top-16 md:top-20 z-30 bg-deep-black/90 backdrop-blur-lg border-b border-dark-gray">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray h-4 w-4" />
            <Input 
              placeholder="Search your library..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-near-black border-dark-gray text-off-white placeholder:text-mid-gray w-full focus-visible:ring-orange"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold whitespace-nowrap transition-all ${
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

      {/* Library Grid */}
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          {loading ? (
            <div className="text-center py-20 text-mid-gray animate-pulse">
              Loading your library...
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-32 flex flex-col items-center justify-center border border-dashed border-dark-gray rounded-xl bg-near-black/30">
              <LibraryIcon className="w-16 h-16 text-mid-gray/50 mb-4" />
              <h3 className="text-2xl font-heading font-bold text-off-white mb-2">Your library is empty</h3>
              <p className="text-mid-gray mb-8 max-w-sm">
                You haven't purchased any premium resources or guides yet.
              </p>
              <Button asChild className="font-bold">
                <Link to="/resources">Browse Premium Resources</Link>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-mid-gray">
              No items match your search.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item, i) => (
                <StaggerItem key={item.id}>
                  <div className="group bg-near-black rounded-xl overflow-hidden border border-dark-gray hover:border-orange/50 transition-all duration-300 h-full flex flex-col relative">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-orange/10 transition-colors" />
                    
                    <div className="p-6 flex flex-col flex-1 relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-dark-gray/50 text-off-white text-xs font-semibold rounded-full uppercase tracking-wider">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-off-white mt-1 mb-3 group-hover:text-orange transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-auto pt-6">
                        {item.type === 'Article' || item.type === 'Guide' ? (
                          <Button asChild variant="default" className="w-full gap-2 font-bold">
                            <Link to={`/resources/${item.id}`}>
                              <BookOpen size={16} /> Read Now
                            </Link>
                          </Button>
                        ) : item.type === 'Video' ? (
                          <Button asChild variant="outline" className="w-full gap-2 font-bold border-orange text-orange hover:bg-orange hover:text-white">
                            <Link to={`/resources/${item.id}`}>
                              <Play size={16} /> Watch Video
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild variant="secondary" className="w-full gap-2 font-bold bg-dark-gray text-white hover:bg-gray-700">
                            <Link to={`/resources/${item.id}`}>
                              <Download size={16} /> Access File
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyLibrary;
