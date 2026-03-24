import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, BookOpen, Menu, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  id: string;
  title: string;
  slug: string;
  content: string;
  order_index: number;
}

interface GuideResource {
  id: string;
  title: string;
  description: string;
}

const GuideReader = () => {
  const { id, chapterSlug } = useParams<{ id: string; chapterSlug?: string }>();
  const navigate = useNavigate();

  const [guide, setGuide] = useState<GuideResource | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchGuide();
  }, [id]);

  useEffect(() => {
    if (chapters.length > 0) {
      if (chapterSlug) {
        const found = chapters.find((c) => c.slug === chapterSlug);
        setActiveChapter(found || chapters[0]);
      } else {
        setActiveChapter(chapters[0]);
      }
    }
  }, [chapters, chapterSlug]);

  const fetchGuide = async () => {
    setLoading(true);
    const { data: resource } = await supabase
      .from("resources")
      .select("id, title, description")
      .eq("id", id)
      .maybeSingle();

    if (!resource) {
      navigate("/resources", { replace: true });
      return;
    }
    setGuide(resource);

    const { data: chapterData } = await supabase
      .from("guide_chapters")
      .select("*")
      .eq("resource_id", id)
      .order("order_index", { ascending: true });

    setChapters(chapterData || []);
    setLoading(false);
  };

  const currentIndex = activeChapter
    ? chapters.findIndex((c) => c.id === activeChapter.id)
    : 0;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const progress = chapters.length > 0 ? ((currentIndex + 1) / chapters.length) * 100 : 0;

  const navigateToChapter = (chapter: Chapter) => {
    navigate(`/guides/${id}/${chapter.slug}`, { replace: true });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-start text-mid-gray bg-deep-black">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange border-t-transparent rounded-full animate-spin" />
          Loading guide...
        </div>
      </div>
    );
  }

  if (!guide || chapters.length === 0) {
    return (
      <div className="min-h-screen pt-32 bg-deep-black text-off-white flex flex-col items-center gap-4">
        <BookOpen size={48} className="text-mid-gray" />
        <p className="text-mid-gray">This guide has no chapters yet.</p>
        <Link to="/resources" className="text-orange hover:underline text-sm font-semibold">
          ← Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-off-white">
      {/* Progress Bar */}
      <div className="fixed top-16 md:top-20 left-0 right-0 z-30 h-1 bg-near-black">
        <motion.div
          className="h-full bg-gradient-to-r from-orange to-orange-light"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex pt-16 md:pt-20">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange text-white rounded-full shadow-lg shadow-orange/30 flex items-center justify-center hover:bg-orange-dark transition-colors"
          aria-label="Toggle chapters"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              className={`fixed lg:sticky top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-80 bg-near-black border-r border-dark-gray z-40 flex flex-col overflow-hidden
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                transition-transform duration-300 ease-out`}
            >
              {/* Guide Header */}
              <div className="p-5 border-b border-dark-gray flex-shrink-0">
                <Link
                  to="/resources"
                  className="text-xs text-mid-gray hover:text-orange flex items-center gap-1.5 mb-3 font-medium transition-colors"
                >
                  <ArrowLeft size={12} /> Resources
                </Link>
                <h2 className="font-heading font-bold text-lg text-off-white leading-tight">
                  {guide.title}
                </h2>
                <p className="text-xs text-mid-gray mt-1.5 font-mono">
                  {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} · {Math.round(progress)}% complete
                </p>
              </div>

              {/* Chapter List */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
                {chapters.map((chapter, i) => {
                  const isActive = activeChapter?.id === chapter.id;
                  const isPast = i < currentIndex;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => navigateToChapter(chapter)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-start gap-3 group
                        ${isActive
                          ? "bg-orange/10 text-orange border border-orange/20"
                          : isPast
                          ? "text-mid-gray hover:bg-dark-gray/50 hover:text-off-white"
                          : "text-mid-gray/70 hover:bg-dark-gray/50 hover:text-off-white"
                        }`}
                    >
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
                          ${isActive
                            ? "bg-orange text-white"
                            : isPast
                            ? "bg-dark-gray text-mid-gray"
                            : "border border-dark-gray text-mid-gray/50"
                          }`}
                      >
                        {isPast ? "✓" : i + 1}
                      </span>
                      <span className="leading-snug">{chapter.title}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-5rem)] lg:ml-0">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 pb-32">
            {/* Chapter Header */}
            <div className="mb-10">
              <span className="text-orange font-mono text-xs tracking-widest uppercase">
                Chapter {currentIndex + 1} of {chapters.length}
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-off-white mt-3 tracking-tight">
                {activeChapter?.title}
              </h1>
            </div>

            {/* Chapter Content */}
            <article
              className="prose prose-invert prose-orange max-w-none
                prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-off-white
                prose-p:text-mid-gray prose-p:leading-relaxed prose-p:text-base
                prose-a:text-orange prose-a:no-underline hover:prose-a:underline
                prose-code:bg-near-black prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-orange prose-code:text-sm prose-code:font-mono
                prose-pre:bg-near-black prose-pre:border prose-pre:border-dark-gray prose-pre:rounded-xl
                prose-blockquote:border-orange prose-blockquote:bg-near-black/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                prose-img:rounded-xl prose-img:border prose-img:border-dark-gray
                prose-li:text-mid-gray
                prose-strong:text-off-white
                prose-hr:border-dark-gray"
              dangerouslySetInnerHTML={{ __html: activeChapter?.content || "" }}
            />

            {/* Prev / Next Navigation */}
            <div className="mt-16 pt-8 border-t border-dark-gray flex items-stretch gap-4">
              {prevChapter ? (
                <button
                  onClick={() => navigateToChapter(prevChapter)}
                  className="flex-1 group bg-near-black border border-dark-gray rounded-xl p-5 text-left hover:border-orange/40 hover:bg-near-black/80 transition-all duration-200"
                >
                  <span className="text-xs text-mid-gray font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <ChevronLeft size={14} /> Previous
                  </span>
                  <span className="block mt-2 font-heading font-bold text-off-white group-hover:text-orange transition-colors">
                    {prevChapter.title}
                  </span>
                </button>
              ) : (
                <div className="flex-1" />
              )}

              {nextChapter ? (
                <button
                  onClick={() => navigateToChapter(nextChapter)}
                  className="flex-1 group bg-near-black border border-dark-gray rounded-xl p-5 text-right hover:border-orange/40 hover:bg-near-black/80 transition-all duration-200"
                >
                  <span className="text-xs text-mid-gray font-mono uppercase tracking-wider flex items-center justify-end gap-1.5">
                    Next <ChevronRight size={14} />
                  </span>
                  <span className="block mt-2 font-heading font-bold text-off-white group-hover:text-orange transition-colors">
                    {nextChapter.title}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/resources")}
                  className="flex-1 group bg-orange/10 border border-orange/20 rounded-xl p-5 text-right hover:bg-orange/20 transition-all duration-200"
                >
                  <span className="text-xs text-orange font-mono uppercase tracking-wider flex items-center justify-end gap-1.5">
                    Completed! <ChevronRight size={14} />
                  </span>
                  <span className="block mt-2 font-heading font-bold text-orange">
                    Back to Resources
                  </span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuideReader;
