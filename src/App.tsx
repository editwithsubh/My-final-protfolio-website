import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { UserRoute } from "./components/auth/UserRoute.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

// ─── Lazy-loaded pages (code-split per route) ───
const Index = lazy(() => import("./pages/Index.tsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Resources = lazy(() => import("./pages/Resources.tsx"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const GuideReader = lazy(() => import("./pages/GuideReader.tsx"));
const MyLibrary = lazy(() => import("./pages/MyLibrary.tsx"));
const Login = lazy(() => import("./pages/auth/Login.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin pages — separate chunk
const AdminLayout = lazy(() => import("./components/layout/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const BlogList = lazy(() => import("./pages/admin/BlogList.tsx"));
const CreateBlog = lazy(() => import("./pages/admin/CreateBlog.tsx"));
const ResourceList = lazy(() => import("./pages/admin/ResourceList.tsx"));
const CreateResource = lazy(() => import("./pages/admin/CreateResource.tsx"));
const ManagePortfolio = lazy(() => import("./pages/admin/ManagePortfolio.tsx"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-deep-black">
    <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
  </div>
);

const PublicLayout = () => (
  <>
    <Header />
    <main>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/guides/:id" element={<GuideReader />} />
              <Route path="/guides/:id/:chapterSlug" element={<GuideReader />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Authenticated User Library Route */}
              <Route element={<UserRoute />}>
                <Route path="/my-library" element={<MyLibrary />} />
              </Route>
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />

            {/* Admin Dashboard Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
                <Route index element={<AdminDashboard />} />
                <Route path="blogs" element={<BlogList />} />
                <Route path="blog/new" element={<CreateBlog />} />
                <Route path="blog/edit/:id" element={<CreateBlog />} />
                <Route path="resources" element={<ResourceList />} />
                <Route path="resource/new" element={<CreateResource />} />
                <Route path="resource/edit/:id" element={<CreateResource />} />
                <Route path="portfolio" element={<ManagePortfolio />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
