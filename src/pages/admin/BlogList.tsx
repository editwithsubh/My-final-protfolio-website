import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, PlusCircle, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatPrice } from '@/lib/pricing';
import { toast } from 'sonner';

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'unlisted'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) toast.error(`Failed to load blogs: ${error.message}`);
    else setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchBlogs();
  }, []);

  const categories = useMemo(() => ['all', ...Array.from(new Set(blogs.map((blog) => blog.category).filter(Boolean)))], [blogs]);

  const filteredBlogs = useMemo(
    () => blogs.filter((blog) => {
      const normalizedStatus = blog.status ?? 'published';
      const normalizedCategory = blog.category ?? 'General';
      const matchSearch = blog.title?.toLowerCase().includes(search.toLowerCase()) || blog.slug?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || normalizedStatus === filterStatus;
      const matchCategory = filterCategory === 'all' || normalizedCategory === filterCategory;
      return matchSearch && matchStatus && matchCategory;
    }),
    [blogs, filterCategory, filterStatus, search]
  );

  const allVisibleSelected = filteredBlogs.length > 0 && filteredBlogs.every((blog) => selected.includes(blog.id));

  const handleDelete = async (ids: string[]) => {
    const confirmed = window.confirm(ids.length === 1 ? 'Delete this blog post?' : `Delete ${ids.length} blog posts?`);
    if (!confirmed) return;
    const { error } = await supabase.from('blogs').delete().in('id', ids);
    if (error) return toast.error(`Failed to delete blog: ${error.message}`);
    toast.success(ids.length === 1 ? 'Blog deleted' : `${ids.length} blogs deleted`);
    setBlogs((current) => current.filter((blog) => !ids.includes(blog.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
  };

  const handleBulkStatus = async (nextStatus: 'draft' | 'published' | 'unlisted') => {
    const { error } = await supabase.from('blogs').update({ status: nextStatus }).in('id', selected);
    if (error) return toast.error(`Failed to update posts: ${error.message}`);
    setBlogs((current) => current.map((blog) => (selected.includes(blog.id) ? { ...blog, status: nextStatus } : blog)));
    toast.success(`Updated ${selected.length} post(s) to ${nextStatus}`);
    setSelected([]);
  };

  const handleHomepageToggle = async (id: string, featuredHome: boolean) => {
    const { error } = await supabase.from('blogs').update({ featured_home: featuredHome }).eq('id', id);
    if (error) return toast.error(`Failed to update homepage setting: ${error.message}`);
    setBlogs((current) => current.map((blog) => (blog.id === id ? { ...blog, featured_home: featuredHome } : blog)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="mt-2 text-gray-500">Manage your blog posts, drafts, and categories.</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/new" className="flex items-center gap-2"><PlusCircle className="h-4 w-4" />New Post</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">All Posts</CardTitle>
            <span className="text-sm text-gray-500">{filteredBlogs.length} result(s)</span>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or slug..." className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={(value: 'all' | 'draft' | 'published' | 'unlisted') => setFilterStatus(value)}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => <SelectItem key={category} value={category}>{category === 'all' ? 'All categories' : category}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">{selected.length} selected</span>
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus('published')}>Publish</Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus('draft')}>Move to Draft</Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus('unlisted')}>Make Unlisted</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(selected)}>Delete</Button>
            </div>
          )}
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading blogs...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center p-6 text-gray-500">
              <Search className="mb-2 h-8 w-8 opacity-20" />
              <p>No blog posts match the current filters.</p>
            </div>
          ) : (
            <div className="divide-y">
              <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                <Checkbox checked={allVisibleSelected} onCheckedChange={(checked) => setSelected(checked ? filteredBlogs.map((blog) => blog.id) : [])} />
                <span>Posts</span>
              </div>
              {filteredBlogs.map((blog) => {
                const normalizedStatus = blog.status ?? 'published';
                const normalizedCategory = blog.category ?? 'General';
                return (
                  <div key={blog.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selected.includes(blog.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, blog.id] : current.filter((id) => id !== blog.id))} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                          <Badge variant={normalizedStatus === 'published' ? 'default' : normalizedStatus === 'unlisted' ? 'outline' : 'secondary'}>{normalizedStatus}</Badge>
                          <Badge variant="outline">{normalizedCategory}</Badge>
                          {blog.featured_home && <Badge className="bg-orange text-white hover:bg-orange">Homepage</Badge>}
                        </div>
                        <p className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>{blog.created_at ? format(new Date(blog.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                          <span>Slug: /{blog.slug}</span>
                          <span>{blog.is_paid ? `Paid (${formatPrice(blog.price || 0, blog.currency)})` : 'Free'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 pr-2 text-xs text-gray-500">
                        <span>Home</span>
                        <Switch checked={!!blog.featured_home} onCheckedChange={(checked) => handleHomepageToggle(blog.id, checked)} />
                      </div>
                      <Button variant="outline" size="sm" asChild><Link to={`/admin/blog/edit/${blog.id}`}>Edit</Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete([blog.id])}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogList;
