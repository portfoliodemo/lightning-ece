import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of our user
type User = {
  fullName: string;
  email: string;
  password: string;
  role: "ECE" | "Childcare Centre";
};

// This is what the context provides
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

// Create the context (but don't fill it yet)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage if they refreshed the page
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function: update state + save to storage
  const login = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser(user);
  };

  // Logout function clears everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Reusable hook for components to get auth data
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}