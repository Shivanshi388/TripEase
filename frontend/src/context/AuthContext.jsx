import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const value = localStorage.getItem("tripease_user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return {
        success: false,
        message: "Enter your email address and password.",
      };
    }

    // Frontend-only demo: accept any non-empty credentials.
    // This is not real authentication and must not protect private data.
    const sessionUser = {
      name: normalizedEmail.split("@")[0].replace(/[._-]+/g, " "),
      email: normalizedEmail,
    };

    localStorage.setItem("tripease_user", JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  };

  const signup = (name, email, password) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return {
        success: false,
        message: "Please complete all required fields.",
      };
    }

    // Store only the non-sensitive demo session, never the password.
    const sessionUser = {
      name: normalizedName,
      email: normalizedEmail,
    };

    localStorage.setItem("tripease_user", JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("tripease_user");
    setUser(null);
    window.location.hash = "#home";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
