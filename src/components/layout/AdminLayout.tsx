import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderPlus, Video, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-deep-black text-off-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-dark-gray bg-near-black flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold tracking-tight text-off-white">Admin Portal</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive ? "bg-orange/10 text-orange" : "text-mid-gray hover:bg-dark-gray hover:text-off-white"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive ? "bg-orange/10 text-orange" : "text-mid-gray hover:bg-dark-gray hover:text-off-white"
              )
            }
          >
            <FileText className="h-4 w-4" />
            Blogs
          </NavLink>
          
          <NavLink
            to="/admin/resources"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive ? "bg-orange/10 text-orange" : "text-mid-gray hover:bg-dark-gray hover:text-off-white"
              )
            }
          >
            <FolderPlus className="h-4 w-4" />
            Resources
          </NavLink>
          
          <NavLink
            to="/admin/portfolio"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive ? "bg-orange/10 text-orange" : "text-mid-gray hover:bg-dark-gray hover:text-off-white"
              )
            }
          >
            <Video className="h-4 w-4" />
            Portfolio
          </NavLink>
        </nav>
        
        <div className="border-t border-dark-gray p-4">
          <div className="mb-4 truncate px-3 text-xs font-medium text-mid-gray">
            {user?.email}
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-deep-black">
        <div className="mx-auto max-w-5xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
