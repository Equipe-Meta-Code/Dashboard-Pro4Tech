import "./Cadastro.scss";
import password_icon from "../../../assets/password.png";
import user_icon from "../../../assets/person.png";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import api from "../../../services/api";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [roles, setRoles] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = useCallback(async () => {
    if (!nome || !cpf || !login || !senha || !roles) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/users", {
        nome,
        cpf,
        login,
        senha,
        roles,
      });
      console.log(response.data);
      setSuccessMessage("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/login");
      }, 1000); // Redirecionar para a página de login após 1 segundos
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setError("Erro ao cadastrar usuário. Por favor, tente novamente.");
    }
  }, [nome, cpf, login, senha, roles, navigate]);

  const voltarSubmit = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <div className="title-label">Cadastro</div>
      <div className="content">
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Nome" onChange={(event) => setNome(event.target.value)} />
          </div>
          <div className="input"><img src={user_icon} alt="" />
            <input type="text" placeholder="CPF" onChange={(event) => setCpf(event.target.value)} />
          </div>
          <div className="input"><img src={user_icon} alt="" />
            <input type="text" placeholder="Login" onChange={(event) => setLogin(event.target.value)} />
          </div>
          <div className="input"><img src={user_icon} alt="" />
            <input type="text" placeholder="Roles" onChange={(event) => setRoles(event.target.value)} />
          </div>
          <div className="input"><img src={password_icon} alt="" />
            <input type="password" placeholder="Senha" onChange={(event) => setSenha(event.target.value)} />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <div className="submit-container">
          <div className="submit" onClick={voltarSubmit}>Voltar</div>
          <div className="submit" onClick={handleSubmit}>Cadastrar</div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
