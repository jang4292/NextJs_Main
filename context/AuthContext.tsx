"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string) => { success: boolean; message: string };
  deleteAccount: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "app_users";
const SESSION_KEY = "app_session";

function getStoredUsers(): Array<User & { password: string }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: Array<User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Ensure default admin user exists
    const users = getStoredUsers();
    const adminExists = users.find((u) => u.username === "admin");
    if (!adminExists) {
      users.push({
        id: "admin-001",
        username: "admin",
        email: "admin@example.com",
        password: "password",
        createdAt: new Date().toISOString(),
      });
      saveUsers(users);
    }

    // Restore session
    const session = getSession();
    if (session) {
      setUser(session);
    }
  }, []);

  function login(username: string, password: string): boolean {
    const users = getStoredUsers();
    const found = users.find((u) => u.username === username && u.password === password);
    if (found) {
      const sessionUser: User = {
        id: found.id,
        username: found.username,
        email: found.email,
        createdAt: found.createdAt,
      };
      setUser(sessionUser);
      saveSession(sessionUser);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    saveSession(null);
  }

  function register(
    username: string,
    email: string,
    password: string
  ): { success: boolean; message: string } {
    const users = getStoredUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, message: "이미 사용 중인 아이디입니다." };
    }
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "이미 사용 중인 이메일입니다." };
    }
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, message: "회원가입이 완료되었습니다." };
  }

  function deleteAccount() {
    if (!user) return;
    const users = getStoredUsers().filter((u) => u.id !== user.id);
    saveUsers(users);
    setUser(null);
    saveSession(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, deleteAccount, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
