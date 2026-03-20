import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderPlus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Admin Portal</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <FolderPlus className="h-4 w-4" />
            Resources
          </NavLink>
        </nav>
        
        <div className="p-4 border-t">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Exit Admin
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
