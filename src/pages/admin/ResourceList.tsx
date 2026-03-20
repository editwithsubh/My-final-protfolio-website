import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, FileText, File, Video, FileArchive } from 'lucide-react';
import { format } from 'date-fns';

const ResourceList = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching resources:', error);
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Article': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'PDF': return <FileArchive className="h-5 w-5 text-red-500" />;
      case 'Video': return <Video className="h-5 w-5 text-purple-500" />;
      case 'File': default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-gray-500 mt-2">Manage your downloadable files and links here.</p>
        </div>
        <Button asChild>
          <Link to="/admin/resource/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Resource
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-medium">All Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="p-6 flex flex-col items-center justify-center text-gray-500 h-40">
              <Search className="h-8 w-8 mb-2 opacity-20" />
              <p>No resources found. Create your first resource!</p>
            </div>
          ) : (
            <div className="divide-y relative">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-2 border rounded-md shadow-sm">
                      {getIconForType(resource.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex gap-4">
                        <span>{format(new Date(resource.created_at), 'MMM d, yyyy')}</span>
                        <span>Type: {resource.type}</span>
                        <span className="capitalize">{resource.is_paid ? `Paid ($${resource.price || 0})` : 'Free'}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/resource/edit/${resource.id}`}>Edit</Link>
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

export default ResourceList;
