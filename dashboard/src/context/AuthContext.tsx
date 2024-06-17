// AuthContext.tsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { ThemeContext } from "./ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";

interface AuthContextState {
    token: string;
    login: string | null;
    signIn(userData: UserData): Promise<void>;
    userLogged(): boolean;
    signOut(): void;
}

interface UserData {
    login: string;
    senha: string;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string>(() => {
        const token = localStorage.getItem('@Upload:token');
        if (token) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            return token;
        }
        return '';
    });

    const [login, setLogin] = useState<string | null>(() => {
        return localStorage.getItem('@Upload:login');
    });

    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        if (theme === DARK_THEME) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    const signIn = useCallback(async ({ login, senha }: UserData) => {
        const response = await api.post('/sessions', { login, senha });
        const { token } = response.data;

        setToken(token);
        setLogin(login);

        localStorage.setItem('@Upload:token', token);
        localStorage.setItem('@Upload:login', login);
        api.defaults.headers.authorization = `Bearer ${token}`;
    }, []);

    const signOut = useCallback(() => {
        setToken('');
        setLogin(null);
        localStorage.removeItem('@Upload:token');
        localStorage.removeItem('@Upload:login');
        window.location.href = '/';
    }, []);

    const userLogged = useCallback(() => {
        return !!localStorage.getItem('@Upload:token');
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, signIn, userLogged, signOut }}>
            {children}
            <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
                <img className="theme-icon" src={theme === LIGHT_THEME ? SunIcon : MoonIcon} alt="Theme Icon" />
            </button>
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextState {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };
