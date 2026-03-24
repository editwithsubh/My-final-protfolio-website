import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs: ' + error.message);
      } else {
        setBlogs(data || []);
      }
      setLoading(false);
    };

    fetchBlogs();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-gray-500 mt-2">Manage your blog posts here.</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-medium">All Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="p-6 flex flex-col items-center justify-center text-gray-500 h-40">
              <Search className="h-8 w-8 mb-2 opacity-20" />
              <p>No blogs found. Create your first post!</p>
            </div>
          ) : (
            <div className="divide-y relative">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span>{blog.created_at ? format(new Date(blog.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                      <span>Slug: /{blog.slug}</span>
                      <span className="capitalize">{blog.is_paid ? `Paid ($${blog.price || 0})` : 'Free'}</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/blog/edit/${blog.id}`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogList;
