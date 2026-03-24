import { useState, useEffect } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { ArrowRight, Download, ShoppingBag, Pickaxe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Standard utility to strip tags and truncate
const extractExcerpt = (htmlContent: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = htmlContent || "";
  return (tmp.textContent || tmp.innerText || "").substring(0, 120) + "...";
};

const Resources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load resources. Please try again.');
      } else {
        setResources(data || []);
      }
      setLoading(false);
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive dynamic categories
  const categories = ["All", ...Array.from(new Set(resources.map(r => r.type)))];

  const filtered = resources.filter((r) => {
    const catMatch = activeCategory === "All" || r.type === activeCategory;
    const priceMatch =
      priceFilter === "all" ||
      (priceFilter === "free" && !r.is_paid) ||
      (priceFilter === "paid" && r.is_paid);
    return catMatch && priceMatch;
  });

  return (
    <>
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <ScrollReveal>
            <p className="font-handwritten text-xl text-orange mb-2">resources & shop</p>
            <h1 className="font-display text-6xl md:text-8xl text-off-white tracking-wider">RESOURCES</h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg">
              Free guides, templates, and premium toolkits to level up your work.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 md:top-20 z-30 bg-deep-black/90 backdrop-blur-lg border-b border-dark-gray">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] py-4 space-y-3">
          <div className="flex gap-2">
            {(["all", "free", "paid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPriceFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                  priceFilter === f
                    ? "bg-orange text-primary-foreground"
                    : "border border-dark-gray text-mid-gray hover:border-orange hover:text-orange"
                }`}
              >
                {f === "all" ? "All" : f === "free" ? "Free" : "Premium"}
              </button>
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-5 py-2 rounded-full text-sm font-heading font-semibold whitespace-nowrap transition-all ${
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

      {/* Grid */}
      <section className="section-dark py-16 min-h-[50vh]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          {loading ? (
             <div className="text-center text-mid-gray font-body py-12">Loading resources...</div>
          ) : error ? (
            <div className="text-center text-red-400 font-body py-12">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-mid-gray font-body py-12">No resources found for this filter.</div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.08}>
              {filtered.map((resource, i) => (
                <StaggerItem key={resource.id}>
                  <Link 
                    to={`/resources/${resource.id}`}
                    className="group bg-near-black rounded-xl overflow-hidden border border-dark-gray hover:-translate-y-1 hover:shadow-lg hover:shadow-orange/10 transition-all duration-300 h-full flex flex-col block"
                  >
                    {(resource.is_paid || resource.type) && (
                      <div className="flex items-center gap-2 px-6 pt-4">
                        {resource.type && (
                          <span className="px-3 py-1 bg-mid-gray text-off-white text-xs font-semibold rounded-full">
                            {resource.type}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading font-bold text-base text-off-white mt-2 mb-3 group-hover:text-orange transition-colors">
                        {resource.title}
                      </h3>
                      <p className="font-body text-sm text-mid-gray leading-relaxed flex-1">
                        {extractExcerpt(resource.description)}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange text-sm font-heading font-semibold">
                          {resource.is_paid ? <ShoppingBag size={14} /> : <Pickaxe size={14} />}
                          {resource.is_paid ? "Get Premium Access" : "View Resource"}
                        </div>
                        {resource.is_paid && (
                          <span className="font-display text-2xl text-orange">${resource.price}</span>
                        )}
                      </div>
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

export default Resources;
