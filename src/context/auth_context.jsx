import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // new

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://localhost:443/api/user/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        const res = await fetch("https://localhost:443/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(credentials),
        });

        if (!res.ok) {
            // Try to parse the error message from response JSON
            let errorData;
            try {
                errorData = await res.json();
            } catch {
                errorData = { message: "Login failed" };
            }

            // Throw an object that contains the error message and status for React Query
            const error = new Error(errorData.message || "Login failed");
            error.status = res.status;
            error.data = errorData;
            throw error;
        }

        const user = await res.json();
        setUser(user);
        return user;
    };

    const logout = async () => {
        try {
            await fetch("https://localhost:443/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
