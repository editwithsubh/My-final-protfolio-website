import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Types ─── */
interface Resource {
  id: number;
  title: string;
  category: string;
  description: string;
  type: string;
  price: string;
  tag: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  client: string;
  duration: string;
}

interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
}

/* ─── Initial mock data ─── */
const initialResources: Resource[] = [
  { id: 1, title: "Free Cinematic LUTs Pack", category: "Free Assets", description: "10 professional color grading LUTs.", type: "Download", price: "", tag: "" },
  { id: 2, title: "Cinematic LUT Bundle Pro", category: "Editing Templates", description: "25 premium cinematic LUTs.", type: "Download", price: "₹499", tag: "Best Seller" },
];

const initialProjects: Project[] = [
  { id: 1, title: "Brand Story — Luxury Fashion Campaign", category: "YouTube", client: "Fashion House", duration: "8 min" },
];

const initialPosts: BlogPost[] = [
  { id: 1, title: "10 Best AI Tools Every Video Editor Needs in 2026", category: "AI Tools", excerpt: "Discover AI-powered tools...", readTime: "6 min" },
];

/* ─── Reusable form field ─── */
const Field = ({ label, value, onChange, placeholder = "", id }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; id?: string }) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
  <div className="space-y-1">
    <label htmlFor={fieldId} className="text-xs font-heading font-semibold text-mid-gray uppercase tracking-wider">{label}</label>
    <input
      id={fieldId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-deep-black border border-dark-gray rounded-lg text-off-white text-sm font-body focus:border-orange focus:outline-none transition-colors"
    />
  </div>
  );
};

/* ─── Tabs config ─── */
const tabs = [
  { key: "resources", label: "Resources & Shop" },
  { key: "portfolio", label: "Portfolio" },
  { key: "blog", label: "Blog" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("resources");
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  // Editing states
  const [editingId, setEditingId] = useState<number | null>(null);

  /* ─── Resource CRUD ─── */
  const [newResource, setNewResource] = useState<Omit<Resource, "id">>({ title: "", category: "", description: "", type: "Download", price: "", tag: "" });

  const addResource = () => {
    if (!newResource.title) return;
    setResources([...resources, { ...newResource, id: Date.now() }]);
    setNewResource({ title: "", category: "", description: "", type: "Download", price: "", tag: "" });
  };

  /* ─── Project CRUD ─── */
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({ title: "", category: "", client: "", duration: "" });

  const addProject = () => {
    if (!newProject.title) return;
    setProjects([...projects, { ...newProject, id: Date.now() }]);
    setNewProject({ title: "", category: "", client: "", duration: "" });
  };

  /* ─── Blog CRUD ─── */
  const [newPost, setNewPost] = useState<Omit<BlogPost, "id">>({ title: "", category: "", excerpt: "", readTime: "" });

  const addPost = () => {
    if (!newPost.title) return;
    setPosts([...posts, { ...newPost, id: Date.now() }]);
    setNewPost({ title: "", category: "", excerpt: "", readTime: "" });
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-orange" size={28} />
            <h1 className="font-display text-4xl md:text-5xl text-off-white tracking-wider">ADMIN</h1>
          </div>
          <Link to="/" className="text-sm font-heading text-mid-gray hover:text-orange transition-colors">
            ← Back to site
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-gray pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-heading font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-orange text-primary-foreground"
                  : "border border-dark-gray text-mid-gray hover:border-orange hover:text-orange"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ Resources & Shop Tab ═══ */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            {/* Add form */}
            <div className="bg-near-black border border-dark-gray rounded-xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-off-white">Add Resource / Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={newResource.title} onChange={(v) => setNewResource({ ...newResource, title: v })} placeholder="e.g. Cinematic LUTs Pack" />
                <Field label="Category" value={newResource.category} onChange={(v) => setNewResource({ ...newResource, category: v })} placeholder="e.g. Free Assets, Editing Templates" />
                <Field label="Description" value={newResource.description} onChange={(v) => setNewResource({ ...newResource, description: v })} placeholder="Short description" />
                <Field label="Type" value={newResource.type} onChange={(v) => setNewResource({ ...newResource, type: v })} placeholder="Download / Guide / Article" />
                <Field label="Price (leave empty for free)" value={newResource.price} onChange={(v) => setNewResource({ ...newResource, price: v })} placeholder="e.g. ₹499" />
                <Field label="Tag" value={newResource.tag} onChange={(v) => setNewResource({ ...newResource, tag: v })} placeholder="e.g. Best Seller, New" />
              </div>
              <button onClick={addResource} className="flex items-center gap-2 px-6 py-2.5 bg-orange text-primary-foreground font-heading font-semibold text-sm rounded-full hover:bg-orange-dark transition-colors">
                <Plus size={16} /> Add Resource
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {resources.map((r) => (
                <div key={r.id} className="bg-near-black border border-dark-gray rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-off-white truncate">{r.title}</span>
                      {r.price && <span className="text-xs px-2 py-0.5 rounded-full bg-orange/20 text-orange font-mono">{r.price}</span>}
                      {!r.price && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-mono">Free</span>}
                    </div>
                    <p className="text-xs text-mid-gray mt-1">{r.category} · {r.type}</p>
                  </div>
                  <button onClick={() => setResources(resources.filter((x) => x.id !== r.id))} aria-label="Delete resource" className="text-mid-gray hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Portfolio Tab ═══ */}
        {activeTab === "portfolio" && (
          <div className="space-y-8">
            <div className="bg-near-black border border-dark-gray rounded-xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-off-white">Add Portfolio Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={newProject.title} onChange={(v) => setNewProject({ ...newProject, title: v })} placeholder="Project title" />
                <Field label="Category" value={newProject.category} onChange={(v) => setNewProject({ ...newProject, category: v })} placeholder="YouTube, Ads, Motion Graphics" />
                <Field label="Client" value={newProject.client} onChange={(v) => setNewProject({ ...newProject, client: v })} placeholder="Client name" />
                <Field label="Duration" value={newProject.duration} onChange={(v) => setNewProject({ ...newProject, duration: v })} placeholder="e.g. 8 min" />
              </div>
              <button onClick={addProject} className="flex items-center gap-2 px-6 py-2.5 bg-orange text-primary-foreground font-heading font-semibold text-sm rounded-full hover:bg-orange-dark transition-colors">
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="bg-near-black border border-dark-gray rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="font-heading font-bold text-sm text-off-white truncate">{p.title}</span>
                    <p className="text-xs text-mid-gray mt-1">{p.category} · {p.client} · {p.duration}</p>
                  </div>
                  <button onClick={() => setProjects(projects.filter((x) => x.id !== p.id))} className="text-mid-gray hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Blog Tab ═══ */}
        {activeTab === "blog" && (
          <div className="space-y-8">
            <div className="bg-near-black border border-dark-gray rounded-xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-off-white">Add Blog Post</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={newPost.title} onChange={(v) => setNewPost({ ...newPost, title: v })} placeholder="Post title" />
                <Field label="Category" value={newPost.category} onChange={(v) => setNewPost({ ...newPost, category: v })} placeholder="AI Tools, Editing Tips, etc." />
                <Field label="Excerpt" value={newPost.excerpt} onChange={(v) => setNewPost({ ...newPost, excerpt: v })} placeholder="Short summary" />
                <Field label="Read Time" value={newPost.readTime} onChange={(v) => setNewPost({ ...newPost, readTime: v })} placeholder="e.g. 6 min" />
              </div>
              <button onClick={addPost} className="flex items-center gap-2 px-6 py-2.5 bg-orange text-primary-foreground font-heading font-semibold text-sm rounded-full hover:bg-orange-dark transition-colors">
                <Plus size={16} /> Add Post
              </button>
            </div>

            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="bg-near-black border border-dark-gray rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="font-heading font-bold text-sm text-off-white truncate">{p.title}</span>
                    <p className="text-xs text-mid-gray mt-1">{p.category} · {p.readTime}</p>
                  </div>
                  <button onClick={() => setPosts(posts.filter((x) => x.id !== p.id))} className="text-mid-gray hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-12 p-4 border border-dark-gray rounded-lg bg-near-black/50">
          <p className="text-xs text-mid-gray font-body text-center">
            ⚠️ This is a UI mockup. Changes are not persisted. To save data permanently, connect a database via Lovable Cloud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
