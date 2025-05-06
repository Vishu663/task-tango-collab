
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ListCheck } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-full">
              <ListCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">TaskTango</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-100 dark:from-gray-950 dark:to-gray-900 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Manage tasks <span className="text-primary">collaboratively</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
              TaskTango helps teams coordinate, track, and manage tasks efficiently. 
              Collaborate seamlessly with your team and never miss a deadline again.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Task Management" 
              description="Create tasks with detailed attributes including title, description, due date, priority, and status."
            />
            <FeatureCard 
              title="Team Collaboration" 
              description="Assign tasks to team members and get real-time notifications about task updates."
            />
            <FeatureCard 
              title="Comprehensive Dashboard" 
              description="View tasks assigned to you, tasks you created, and overdue tasks all in one place."
            />
            <FeatureCard 
              title="Smart Search & Filters" 
              description="Quickly find tasks with powerful search and filter by status, priority, or due date."
            />
            <FeatureCard 
              title="Calendar View" 
              description="Visualize tasks on a calendar to better plan your work schedule and deadlines."
            />
            <FeatureCard 
              title="User Authentication" 
              description="Secure login and registration system to protect your tasks and team data."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to simplify task management?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join TaskTango today and experience the power of collaborative task management.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-900 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-primary p-1.5 rounded-full">
              <ListCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">TaskTango</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TaskTango. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default Index;
