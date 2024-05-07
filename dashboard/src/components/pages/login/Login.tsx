import "../styles.scss";
import password_icon from '../../../assets/password.png'
import user_icon from '../../../assets/person.png'
import React, { useCallback, useState } from  'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate  } from 'react-router-dom';

const Login = () => {

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();

    const { signIn } = useAuth();

    const handleSubmit = useCallback( async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
         await signIn({ login, senha });
         navigate('dashboard');

    }, [login, senha]);

    const cadastroSubmit = () => {
        navigate('/cadastro');
    };

  return (
    <div className="container">
      <div className="title-label">Login</div>
      <div className="content"> 
      <div className="inputs">
            <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder="Login" onChange={event => setLogin(event.target.value)}/>
            </div>
            <div className="input"> 
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Senha" onChange={event => setSenha(event.target.value)}/>
            </div>
            </div>
            <div className="submit-container">
                <div className="submit" onClick={handleSubmit}>Entrar</div>
                <div className="submit" onClick={cadastroSubmit}>Cadastrar</div>
            </div>
            </div>
        </div>                
  );
};

export default Login;

