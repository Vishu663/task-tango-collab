
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthState } from "../types";
import { mockUsers, currentUser } from "../lib/mockData";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getUser: (userId: string) => User | undefined;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for saved auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("taskTangoUser");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          localStorage.removeItem("taskTangoUser");
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // This is just a mock - in a real app we would validate credentials server-side
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && password === "password") { // In a real app, we would verify the hashed password
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("taskTangoUser", JSON.stringify(user));
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
      throw new Error("Invalid login credentials");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("Email already in use");
      throw new Error("Email already in use");
    }
    
    // In a real app, we would create the user in the database
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      name,
      email,
      avatarUrl: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=6D28D9&color=fff`
    };
    
    // Add to mock users (this would be a DB operation in a real app)
    mockUsers.push(newUser);
    
    // Log the user in
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem("taskTangoUser", JSON.stringify(newUser));
    
    toast.success("Registration successful!");
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("taskTangoUser");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const getUser = (userId: string) => {
    return mockUsers.find((user) => user.id === userId);
  };

  const getAllUsers = () => {
    return mockUsers;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        getUser,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
