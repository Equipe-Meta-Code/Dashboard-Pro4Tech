import { createContext, useCallback, useContext, useState} from "react";
import api from "../services/api";

interface AuthContextState {
    token: TokenState;
    signIn({login, senha}: UserData): Promise<void>;
    userLogged():boolean;
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

    const userLogged = useCallback(() => {
        const token = localStorage.getItem('@Upload:token');
        if(token) {
            return true;
        }
        return false;
    }, []);

    return (
        <AuthContext.Provider value={{ token, signIn, userLogged }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextState {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };