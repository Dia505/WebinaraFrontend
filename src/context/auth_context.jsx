import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://localhost:443/api/user/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user); 
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
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

        if (res.ok) {
            const data = await res.json();
            setUser(data.user); 
        } else {
            throw new Error("Login failed");
        }
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

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
