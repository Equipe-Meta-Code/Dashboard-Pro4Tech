import { createContext, useCallback, useContext, useEffect, useState} from "react";
import api from "../services/api";
import { ThemeContext } from "./ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";


interface AuthContextState {
    token: TokenState;
    signIn({login, senha}: UserData): Promise<void>;
    userLogged():boolean;
    signOut():void;
}

interface UserData {
    login: string;
    senha: string;
}

interface TokenState {
    token: string;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<TokenState>(() => {
        const token = localStorage.getItem('@Upload:token');

        if(token) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            
            return { token }
        }
        return { } as TokenState;
    });

    const { theme, toggleTheme } = useContext(ThemeContext); 
    // adding dark-mode class if the dark mode is set on to the body tag
    useEffect(() => {
        if (theme === DARK_THEME) {
        document.body.classList.add("dark-mode");
        } else {
        document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    const signIn = useCallback(async ({login, senha}: UserData) => {
        const response = await api.post('/sessions', {
            login,
            senha,
        });

        const { token } = response.data;

        setToken(token);

        localStorage.setItem('@Upload:token', token);
        api.defaults.headers.authorization = `Bearer ${token}`;
    }, []);

     const signOut = useCallback(() => {
        setToken({ token: '' });
        localStorage.removeItem('@Upload:token');
        
        window.location.href = '/';
    }, []);

    const userLogged = useCallback(() => {
        const token = localStorage.getItem('@Upload:token');
        if(token) {
            return true;
        }
        return false;
    }, []);

    return (
        <AuthContext.Provider value={{ token, signIn, userLogged, signOut }}>
            {/* Renderize o conteúdo dos filhos */}
            {children}
            
            {/* Adicione o botão de alternância de tema dentro do Provider */}
            <button type='button' className='theme-toggle-btn' onClick={toggleTheme}>
                <img className='theme-icon' src={theme === LIGHT_THEME ? SunIcon : MoonIcon} alt="Theme Icon"/>
            </button>
        </AuthContext.Provider>
    );    
};

function useAuth(): AuthContextState {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };
