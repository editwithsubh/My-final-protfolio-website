import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, File, FileArchive, FileText, PlusCircle, Search, Trash2, Video } from 'lucide-react';
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

const ResourceList = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);

  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (error) toast.error(`Failed to load resources: ${error.message}`);
    else setResources(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchResources();
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Article': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'PDF': return <FileArchive className="h-5 w-5 text-red-500" />;
      case 'Video': return <Video className="h-5 w-5 text-purple-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const types = useMemo(() => ['all', ...Array.from(new Set(resources.map((resource) => resource.type).filter(Boolean)))], [resources]);

  const filteredResources = useMemo(
    () => resources.filter((resource) => resource.title?.toLowerCase().includes(search.toLowerCase()) && (filterType === 'all' || resource.type === filterType)),
    [filterType, resources, search]
  );

  const allVisibleSelected = filteredResources.length > 0 && filteredResources.every((resource) => selected.includes(resource.id));

  const handleDelete = async (ids: string[]) => {
    const confirmed = window.confirm(ids.length === 1 ? 'Delete this resource?' : `Delete ${ids.length} resources?`);
    if (!confirmed) return;
    const { error } = await supabase.from('resources').delete().in('id', ids);
    if (error) return toast.error(`Failed to delete resource: ${error.message}`);
    toast.success(ids.length === 1 ? 'Resource deleted' : `${ids.length} resources deleted`);
    setResources((current) => current.filter((resource) => !ids.includes(resource.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
  };

  const handleBulkStatus = async (nextStatus: 'draft' | 'published') => {
    const { error } = await supabase.from('resources').update({ status: nextStatus }).in('id', selected);
    if (error) return toast.error(`Failed to update resources: ${error.message}`);
    setResources((current) => current.map((resource) => (selected.includes(resource.id) ? { ...resource, status: nextStatus } : resource)));
    toast.success(`Updated ${selected.length} resource(s) to ${nextStatus}`);
    setSelected([]);
  };

  const handleHomepageToggle = async (id: string, featuredHome: boolean) => {
    const { error } = await supabase.from('resources').update({ featured_home: featuredHome }).eq('id', id);
    if (error) return toast.error(`Failed to update homepage setting: ${error.message}`);
    setResources((current) => current.map((resource) => (resource.id === id ? { ...resource, featured_home: featuredHome } : resource)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="mt-2 text-gray-500">Manage your downloadable files, videos, and guides.</p>
        </div>
        <Button asChild>
          <Link to="/admin/resource/new" className="flex items-center gap-2"><PlusCircle className="h-4 w-4" />New Resource</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">All Resources</CardTitle>
            <span className="text-sm text-gray-500">{filteredResources.length} result(s)</span>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search resources..." className="pl-9" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {types.map((type) => <SelectItem key={type} value={type}>{type === 'all' ? 'All types' : type}</SelectItem>)}
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
              <Button variant="destructive" size="sm" onClick={() => handleDelete(selected)}>Delete</Button>
            </div>
          )}
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading resources...</div>
          ) : filteredResources.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center p-6 text-gray-500">
              <Search className="mb-2 h-8 w-8 opacity-20" />
              <p>No resources match the current filters.</p>
            </div>
          ) : (
            <div className="divide-y">
              <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                <Checkbox checked={allVisibleSelected} onCheckedChange={(checked) => setSelected(checked ? filteredResources.map((resource) => resource.id) : [])} />
                <span>Resources</span>
              </div>
              {filteredResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={selected.includes(resource.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, resource.id] : current.filter((id) => id !== resource.id))} />
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <div className="mt-1 rounded-md border bg-white p-2 shadow-sm">{getIconForType(resource.type)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                          <Badge variant="outline">{resource.type || 'Resource'}</Badge>
                          {resource.status && <Badge variant={resource.status === 'published' ? 'default' : 'secondary'}>{resource.status}</Badge>}
                          {resource.featured_home && <Badge className="bg-orange text-white hover:bg-orange">Homepage</Badge>}
                        </div>
                        <p className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>{resource.created_at ? format(new Date(resource.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                          <span>{resource.is_paid ? `Paid (${formatPrice(resource.price || 0, resource.currency)})` : 'Free'}</span>
                          {resource.difficulty && <span>{resource.difficulty}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 pr-2 text-xs text-gray-500">
                      <span>Home</span>
                      <Switch checked={!!resource.featured_home} onCheckedChange={(checked) => handleHomepageToggle(resource.id, checked)} />
                    </div>
                    <Button variant="outline" size="sm" asChild><Link to={`/admin/resource/edit/${resource.id}`}>Edit</Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => window.open(`/resources/${resource.id}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete([resource.id])}><Trash2 className="h-4 w-4" /></Button>
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

export default ResourceList;
