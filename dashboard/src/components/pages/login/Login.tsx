// Login.tsx
import "../styles.scss";
import password_icon from '../../../assets/password.png';
import user_icon from '../../../assets/person.png';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import eyeOpen from "../../../assets/eyeOpen.png";
import eyeClose from "../../../assets/eyeClose.png";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [pageTitle, setPageTitle] = useState('Login');
    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();

    const { signIn } = useAuth();

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        if (!login || !senha) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        try {
            await signIn({ login, senha });
            navigate('dashboard');
        } catch (error) {
            setError("Credenciais inválidas. Por favor, verifique seu login e senha.");
        }
    }, [login, senha, signIn, navigate]);

    return (
        <div className="container">
            <div className="title-label">Login</div>
            <div className="content">
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder="Login" onChange={event => setLogin(event.target.value)} />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type={mostrarSenha ? "text" : "password"} placeholder="Senha" onChange={event => setSenha(event.target.value)} />
                        <button className="eye-icon" onClick={() => setMostrarSenha(!mostrarSenha)}>
                            {mostrarSenha ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
                        </button>
                    </div>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="submit-container">
                    <div className="submit" onClick={handleSubmit}>Entrar</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
