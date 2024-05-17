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

    const handleLoginChange = (event) => {
        const value = event.target.value;
        // Verificar se o valor é um CPF (11 dígitos)
        if (value.length === 11) {
            // Formatar o CPF
            const formattedCPF = formatCPF(value);
            setLogin(formattedCPF);
        } else {
            // Se não for um CPF, manter o valor sem formatação
            setLogin(value);
        }
    };

    const handleSenhaChange = (event) => {
        const value = event.target.value;
        // Verificar se o valor é um CPF (11 dígitos)
        if (value.length === 11) {
            // Formatar o CPF
            const formattedCPF = formatCPF(value);
            setSenha(formattedCPF);
        } else {
            // Se não for um CPF, manter o valor sem formatação
            setSenha(value);
        }
    };

    const formatCPF = (input) => {
        const cleaned = input.replace(/[^\d]/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join('.').replace(/\.$/, '').replace(/\.(?=\d{1,2}$)/, '-');
        }
        return input;
    };

    return (
        <div className="container">
            <div className="title-label">Login</div>
            <div className="content">
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input 
                            type="text" 
                            placeholder="Login" 
                            value={login}
                            onChange={handleLoginChange}
                            maxLength={14} // Limitar o campo para 14 caracteres (com pontos e traços)
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input 
                            type={mostrarSenha ? "text" : "password"} 
                            placeholder="Senha" 
                            value={senha}
                            onChange={handleSenhaChange}
                            maxLength={14} // Limitar o campo para 14 caracteres (com pontos e traços)
                        />
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
