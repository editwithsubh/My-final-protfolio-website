import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, Download, Library as LibraryIcon, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  contentType: 'resource' | 'blog';
  route: string;
  purchasedAt?: string | null;
  cover_image?: string | null;
}

type SpaceKey = 'welcome' | 'resources' | 'announcements' | 'content-bootcamp';

const SIDE_SPACES: Array<{ key: SpaceKey; label: string }> = [
  { key: 'welcome', label: 'Welcome' },
  { key: 'resources', label: 'Resources' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'content-bootcamp', label: 'Content Bootcamp' },
];

const MyLibrary = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSpace, setActiveSpace] = useState<SpaceKey>('resources');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLibrary = async () => {
      setLoading(true);

      const { data: purchases, error: purchaseError } = await supabase
        .from("purchases")
        .select("resource_id, blog_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (purchaseError || !purchases || purchases.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const resourceIds = purchases.map((purchase) => purchase.resource_id).filter(Boolean);
      const blogIds = purchases.map((purchase) => purchase.blog_id).filter(Boolean);

      const [resourceResponse, blogResponse] = await Promise.all([
        resourceIds.length > 0
          ? supabase.from("resources").select("id, title, type, cover_image").in("id", resourceIds)
          : Promise.resolve({ data: [], error: null }),
        blogIds.length > 0
          ? supabase.from("blogs").select("id, title, slug, cover_image").in("id", blogIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      const normalizedResources = (resourceResponse.data || []).map((resource: any) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type || 'Resource',
        contentType: 'resource' as const,
        route: `/resources/${resource.id}`,
        purchasedAt: purchases.find((purchase) => purchase.resource_id === resource.id)?.created_at,
        cover_image: resource.cover_image,
      }));

      const normalizedBlogs = (blogResponse.data || []).map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        type: 'Article',
        contentType: 'blog' as const,
        route: `/blog/${blog.slug}`,
        purchasedAt: purchases.find((purchase) => purchase.blog_id === blog.id)?.created_at,
        cover_image: blog.cover_image,
      }));

      const allItems = [...normalizedResources, ...normalizedBlogs].sort((a, b) => {
        const aTime = a.purchasedAt ? new Date(a.purchasedAt).getTime() : 0;
        const bTime = b.purchasedAt ? new Date(b.purchasedAt).getTime() : 0;
        return bTime - aTime;
      });

      setItems(allItems);
      setLoading(false);
    };

    void fetchLibrary();
  }, [user]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.type)))],
    [items]
  );

  const filtered = useMemo(
    () => items.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "All" || item.type === activeCategory;
      return matchSearch && matchCategory;
    }),
    [activeCategory, items, search]
  );

  const spaceFiltered = useMemo(() => {
    return filtered.filter((item) => {
      switch (activeSpace) {
        case 'welcome':
          return true;
        case 'resources':
          return item.contentType === 'resource';
        case 'announcements':
          return item.contentType === 'blog';
        case 'content-bootcamp':
          return item.type === 'Guide';
        default:
          return true;
      }
    });
  }, [activeSpace, filtered]);

  const getActionLabel = (item: LibraryItem) => {
    if (item.contentType === 'blog') return 'Read Article';
    if (item.type === 'Video') return 'Watch Now';
    if (item.type === 'PDF' || item.type === 'File') return 'Access File';
    if (item.type === 'Guide') return 'Read Guide';
    return 'Read Now';
  };

  const getActionIcon = (item: LibraryItem) => {
    if (item.contentType === 'blog' || item.type === 'Guide' || item.type === 'Article') return <BookOpen size={16} />;
    if (item.type === 'Video') return <Play size={16} />;
    return <Download size={16} />;
  };

  return (
    <div className="min-h-screen bg-deep-black text-off-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px] pt-28 pb-24">
        <div className="flex gap-8">
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-24 border border-dark-gray bg-near-black/50 rounded-2xl p-5">
              <div className="mb-5">
                <div className="text-xs font-mono text-mid-gray mb-3">Spaces</div>
                <div className="space-y-1">
                  {SIDE_SPACES.map((s) => {
                    const active = activeSpace === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setActiveSpace(s.key)}
                        className={`relative w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? 'bg-orange/15 text-orange border border-orange/25'
                            : 'text-mid-gray hover:text-off-white hover:bg-near-black/60 border border-transparent hover:border-dark-gray'
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-orange" />
                        )}
                        <span className={active ? 'pl-2' : ''}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-dark-gray my-4" />

              <div>
                <div className="text-xs font-mono text-mid-gray mb-3">Links</div>
                <div className="space-y-2 text-sm text-mid-gray">
                  <a href="https://www.instagram.com/editwithshub/" target="_blank" rel="noreferrer" className="block hover:text-orange transition-colors">Instagram</a>
                  <a href="https://x.com/editxshub" target="_blank" rel="noreferrer" className="block hover:text-orange transition-colors">X</a>
                  <a href="https://www.linkedin.com/in/editxsubh/" target="_blank" rel="noreferrer" className="block hover:text-orange transition-colors">LinkedIn</a>
                  <a href="mailto:shubhams6068@gmail.com" className="block hover:text-orange transition-colors">Email</a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="block hover:text-orange transition-colors">YouTube Channel</a>
                  <a href="https://play.google.com" target="_blank" rel="noreferrer" className="block hover:text-orange transition-colors">Download the Android app</a>
                  <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer" className="block hover:text-orange transition-colors">Download the iOS app</a>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex flex-col gap-5 mb-6 md:flex-row md:items-center md:justify-between">
              <h1 className="font-display text-3xl tracking-wider text-off-white">
                {activeSpace === 'welcome'
                  ? 'My Library'
                  : activeSpace === 'resources'
                    ? 'Resources'
                    : activeSpace === 'announcements'
                      ? 'Announcements'
                      : 'Content Bootcamp'}
              </h1>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mid-gray" />
                <Input
                  placeholder="Search your library..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full border-dark-gray bg-near-black pl-10 text-off-white placeholder:text-mid-gray focus-visible:ring-orange"
                />
              </div>
            </div>

            {/* Hero banner (visual) */}
            <div className="relative overflow-hidden rounded-2xl border border-dark-gray bg-near-black/60 mb-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(249,115,22,0.30),transparent_60%)] pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-deep-black/70 to-transparent pointer-events-none" />
              <div className="relative p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-mono mb-4">
                  <LibraryIcon className="h-3.5 w-3.5" /> editxsubh library
                </div>
                <h2 className="font-display text-4xl md:text-5xl leading-tight">
                  Templates.
                  <br />
                  Workflows.
                  <br />
                  Frameworks.
                </h2>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex w-full gap-2 overflow-x-auto pb-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-heading font-semibold transition-all border ${
                    activeCategory === category
                      ? 'bg-orange text-primary-foreground border-orange'
                      : 'bg-near-black/20 border-dark-gray text-mid-gray hover:border-orange hover:text-orange'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-20 text-center text-mid-gray animate-pulse">Loading your library...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dark-gray bg-near-black/30 py-32 text-center">
                <LibraryIcon className="mb-4 h-16 w-16 text-mid-gray/50" />
                <h3 className="mb-2 text-2xl font-heading font-bold text-off-white">Your library is empty</h3>
                <p className="mb-8 max-w-sm text-mid-gray">
                  You have not purchased any premium resources yet. Browse the library to unlock something useful.
                </p>
                <Button asChild className="font-bold">
                  <Link to="/resources">Browse Resources</Link>
                </Button>
              </div>
            ) : spaceFiltered.length === 0 ? (
              <div className="py-20 text-center text-mid-gray">No items match your filters.</div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {spaceFiltered.map((item) => (
                  <StaggerItem key={`${item.contentType}-${item.id}`}>
                    <Link to={item.route} className="block h-full group">
                      <div className="h-full rounded-xl border border-dark-gray bg-near-black/70 overflow-hidden transition-all duration-300 hover:border-orange/40 hover:-translate-y-0.5">
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-orange/20 to-near-black">
                          {item.cover_image ? (
                            <img
                              src={item.cover_image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <BookOpen className="text-orange/40" size={40} />
                            </div>
                          )}

                          <span className="absolute left-3 top-3 w-8 h-8 rounded-full bg-green-500/90 flex items-center justify-center text-xs font-bold text-white">
                            A
                          </span>

                          <div className="absolute right-3 top-3 flex gap-2">
                            <span className="rounded-full bg-black/65 px-2 py-1 text-[11px] font-mono uppercase tracking-wide text-off-white">
                              {item.type}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-heading text-lg font-bold text-off-white group-hover:text-orange transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs text-mid-gray">
                            Purchased{" "}
                            {item.purchasedAt
                              ? formatDistanceToNow(new Date(item.purchasedAt), { addSuffix: true })
                              : "recently"}
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs text-mid-gray">
                            <span className="text-orange">{getActionIcon(item)}</span>
                            <span className="font-semibold">{getActionLabel(item)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
