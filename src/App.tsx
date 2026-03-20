import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Resources from "./pages/Resources.tsx";
import Admin from "./pages/Admin.tsx";
import Blog from "./pages/Blog.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./components/layout/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import BlogList from "./pages/admin/BlogList.tsx";
import CreateBlog from "./pages/admin/CreateBlog.tsx";
import ResourceList from "./pages/admin/ResourceList.tsx";
import CreateResource from "./pages/admin/CreateResource.tsx";
import ManagePortfolio from "./pages/admin/ManagePortfolio.tsx";

const queryClient = new QueryClient();

const PublicLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/admin-auth" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blog/new" element={<CreateBlog />} />
            <Route path="resources" element={<ResourceList />} />
            <Route path="resource/new" element={<CreateResource />} />
            <Route path="portfolio" element={<ManagePortfolio />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
