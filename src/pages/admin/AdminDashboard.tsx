import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderPlus, Video, ShoppingCart, IndianRupee, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  blogs: number;
  drafts: number;
  unlisted: number;
  resources: number;
  guides: number;
  purchases: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ blogs: 0, drafts: 0, unlisted: 0, resources: 0, guides: 0, purchases: 0, revenue: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [blogs, drafts, unlisted, resources, guides, posts, purchasesResult] = await Promise.all([
          supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
          supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('status', 'unlisted'),
          supabase.from('resources').select('id', { count: 'exact', head: true }),
          supabase.from('resources').select('id', { count: 'exact', head: true }).eq('type', 'Guide'),
          supabase.from('blogs').select('id, title, slug, created_at, status').order('created_at', { ascending: false }).limit(5),
          supabase.from('purchases').select('id, amount'),
        ]);

        const totalRevenue = (purchasesResult.data || []).reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

        setStats({
          blogs: blogs.count ?? 0,
          drafts: drafts.count ?? 0,
          unlisted: unlisted.count ?? 0,
          resources: resources.count ?? 0,
          guides: guides.count ?? 0,
          purchases: purchasesResult.data?.length ?? 0,
          revenue: totalRevenue,
        });
        setRecentPosts(posts.data || []);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-gray-500">Overview of your publishing pipeline and recent content.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published Blogs</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blogs}</div>
            <CardDescription>Posts currently live on the site</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft Blogs</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <CardDescription>Posts still waiting for review</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unlisted Blogs</CardTitle>
            <EyeOff className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unlisted}</div>
            <CardDescription>Accessible via link only</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <FolderPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resources}</div>
            <CardDescription>Total files, videos, and guides</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Guides</CardTitle>
            <Video className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.guides}</div>
            <CardDescription>Structured chapter-based resources</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.purchases}</div>
            <CardDescription>Paid content transactions</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
            <CardDescription>Total earnings from purchases</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
          <CardDescription>Your 5 most recent blog entries</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No blog posts yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500">/{post.slug}</p>
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : post.status === 'unlisted' ? 'outline' : 'secondary'} className="text-xs">
                      {post.status || 'published'}
                    </Badge>
                  </div>
                  <Link to={`/admin/blog/edit/${post.id}`} className="text-sm text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
