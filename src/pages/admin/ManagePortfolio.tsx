import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2, Monitor, Smartphone, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const CATEGORIES = ['All', 'YouTube', 'Short-Form', 'Motion Graphics', 'Ads & Commercials', 'Color Grading', 'Brand Films'];

const ManagePortfolio = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [videoType, setVideoType] = useState<'long' | 'short'>('long');
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
    if (!title || !url || category.length === 0) {
      toast.error('Please fill required fields and select at least one category.');
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }

    setLoading(true);

    // Auto-detect shorts from URL
    const detectedType = url.includes('/shorts/') ? 'short' : videoType;

    const { error } = await supabase.from('portfolio_videos').insert([
      {
        title,
        description,
        client,
        youtube_url: url,
        video_id: videoId,
        category: category.join(','),
        video_type: detectedType,
      },
    ]);

    if (error) {
      toast.error('Failed to add portfolio video: ' + error.message);
    } else {
      toast.success('Portfolio video added successfully');
      setTitle('');
      setDescription('');
      setClient('');
      setUrl('');
      setVideoType('long');
      setCategory([]);
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

  const handleHomepageToggle = async (id: string, featuredHome: boolean) => {
    const { error } = await supabase
      .from('portfolio_videos')
      .update({ featured_home: featuredHome })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update homepage selection: ' + error.message);
      return;
    }

    setVideos((current) => current.map((video) => (
      video.id === id ? { ...video, featured_home: featuredHome } : video
    )));
    toast.success(featuredHome ? 'Added to homepage work section' : 'Removed from homepage work section');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Videos</h1>
        <p className="text-gray-500 mt-2">Manage your YouTube portfolio items. Supports public, unlisted, and shorts links.</p>
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
                <Label htmlFor="youtube-url">YouTube URL <span className="font-normal text-gray-400">(public, unlisted, or shorts)</span></Label>
                <Input 
                  id="youtube-url" 
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categories <span className="font-normal text-gray-400">(select one or more)</span></Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c !== 'All').map((cat) => {
                  const isSelected = category.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(prev =>
                          prev.includes(cat)
                            ? prev.filter(c => c !== cat)
                            : [...prev, cat]
                        );
                      }}
                      className={`px-3 py-1.5 border rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {isSelected && '✓ '}{cat}
                    </button>
                  );
                })}
              </div>
              {category.length === 0 && <p className="text-xs text-red-400">Select at least one category</p>}
            </div>

            <div className="space-y-2">
              <Label>Video Format</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setVideoType('long')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                    videoType === 'long'
                      ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  Standard (16:9)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoType('short')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                    videoType === 'short'
                      ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Short (9:16)
                </button>
              </div>
              <p className="text-xs text-gray-400">Shorts URLs are auto-detected. This controls how the video renders on the portfolio grid.</p>
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

            <div className="space-y-2">
              <Label htmlFor="client">Client Name (optional)</Label>
              <Input
                id="client"
                placeholder="e.g. Nike, Personal Project"
                value={client}
                onChange={(e) => setClient(e.target.value)}
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
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium flex-wrap">
                      {(vid.category || '').split(',').map((cat: string) => (
                        <span key={cat} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{cat.trim()}</span>
                      ))}
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${vid.video_type === 'short' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}`}>
                        {vid.video_type === 'short' ? '9:16 Short' : '16:9 Standard'}
                      </span>
                      {vid.client && <span>{vid.client}</span>}
                      <span>{format(new Date(vid.created_at), 'MMM d, yyyy')}</span>
                      {vid.featured_home && <span className="bg-orange/10 text-orange px-2 py-0.5 rounded-full">Homepage</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:ml-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Show on homepage</span>
                      <Switch
                        checked={!!vid.featured_home}
                        onCheckedChange={(checked) => handleHomepageToggle(vid.id, checked)}
                      />
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
