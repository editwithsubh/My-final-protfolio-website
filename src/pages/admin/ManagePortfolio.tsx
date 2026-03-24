import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

const CATEGORIES = ['All', 'YouTube', 'Short-Form', 'Motion Graphics', 'Ads & Commercials', 'Color Grading', 'Brand Films'];

const ManagePortfolio = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('portfolio_videos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error('Error fetching videos');
    } else {
      setVideos(data || []);
    }
    setFetching(false);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !category) {
      toast.error('Please fill required fields.');
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('portfolio_videos').insert([
      {
        title,
        description,
        youtube_url: url,
        video_id: videoId,
        category,
      },
    ]);

    if (error) {
      toast.error('Failed to add portfolio video: ' + error.message);
    } else {
      toast.success('Portfolio video added successfully');
      setTitle('');
      setDescription('');
      setUrl('');
      fetchVideos();
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    const { error } = await supabase.from('portfolio_videos').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete video: ' + error.message);
    } else {
      toast.success('Video deleted');
      fetchVideos();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Videos</h1>
        <p className="text-gray-500 mt-2">Manage your YouTube portfolio items here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. My Next.js E-commerce Build" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input 
                  id="youtube-url" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea 
                id="desc" 
                placeholder="Brief details about the project..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="h-24"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Video to Portfolio'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Videos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {fetching ? (
             <div className="p-6 text-center text-gray-500">Loading portfolio...</div>
          ) : videos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No videos found.</div>
          ) : (
            <div className="divide-y relative">
              {videos.map((vid) => (
                <div key={vid.id} className="p-4 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-full md:w-32 aspect-video bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={getYouTubeThumbnail(vid.video_id)} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className="font-semibold text-gray-900">{vid.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{vid.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{vid.category}</span>
                      <span>{format(new Date(vid.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 md:ml-auto"
                    onClick={() => handleDelete(vid.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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

export default ManagePortfolio;
