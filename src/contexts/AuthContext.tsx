import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthState } from "../types";
import { toast } from "sonner";

const API_URL =
  "http://https://task-tango-backend-bdlcum2x4-vishu663s-projects.vercel.app/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getAllUsers: () => User[];
  getUser: (userId: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [users, setUsers] = useState<User[]>([]);

  // Check for saved auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("taskTangoUser");
      const savedToken = localStorage.getItem("taskTangoToken");

      if (savedUser && savedToken) {
        try {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          // Fetch users after successful authentication
          fetchUsers();
        } catch (e) {
          localStorage.removeItem("taskTangoUser");
          localStorage.removeItem("taskTangoToken");
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("taskTangoToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const getAllUsers = () => {
    return users;
  };

  const getUser = (userId: string) => {
    return users.find((user) => user._id === userId);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem("taskTangoUser", JSON.stringify(data.user));
      localStorage.setItem("taskTangoToken", data.token);

      // Fetch users after successful login
      await fetchUsers();

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const data = await response.json();

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem("taskTangoUser", JSON.stringify(data.user));
      localStorage.setItem("taskTangoToken", data.token);

      // Fetch users after successful registration
      await fetchUsers();

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("taskTangoUser");
    localStorage.removeItem("taskTangoToken");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setUsers([]);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        getAllUsers,
        getUser,
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
