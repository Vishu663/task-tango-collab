
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import TopNav from "./TopNav";
import MobileNav from "./MobileNav";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AppLayout = ({ children, requireAuth = true }: AppLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if authenticated and viewing an auth page (login/register)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <TopNav />
          <main className="flex-1 p-4 md:p-6 w-full animate-fade-in pb-16 md:pb-6">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
