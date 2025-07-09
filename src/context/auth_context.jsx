import { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getInitialToken = () => {
        const saved = JSON.parse(localStorage.getItem("authData"));
        if (saved?.token) {
            try {
                const decoded = jwtDecode(saved.token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    localStorage.removeItem("authData");
                    return null;
                }
                return saved.token;
            } catch {
                localStorage.removeItem("authData");
                return null;
            }
        }
        return null;
    };

    const [authToken, setAuthToken] = useState(getInitialToken());

    const login = (token) => {
        const authData = { token }; 
        setAuthToken(token);
        localStorage.setItem("authData", JSON.stringify(authData));  
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("authData"); 
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);