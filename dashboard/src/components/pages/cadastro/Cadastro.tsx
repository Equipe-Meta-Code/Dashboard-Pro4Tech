import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import user_icon from "../../../assets/person.png";
import password_icon from "../../../assets/password.png";
import eyeOpen from "../../../assets/eyeOpen.png";
import eyeClose from "../../../assets/eyeClose.png";

const Cadastro = () => {

  const [pageTitle, setPageTitle] = useState('Cadastro');
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState(""); 
  const [roles, setRoles] = useState(""); 
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  const formatarCPF = (value) => {
    const cpfDigits = value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
    let formattedCPF = cpfDigits.slice(0, 11); // Garante que o CPF tenha no máximo 11 dígitos

    // Aplica a máscara de formatação do CPF
    formattedCPF = formattedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setCpf(formattedCPF);
  };

  const handleSubmit = async () => {
    setError(""); // Limpar mensagem de erro anterior
    setSuccessMessage(""); // Limpar mensagem de sucesso anterior

    if (cpf.length !== 14) { // Verifica se o CPF tem 14 caracteres, incluindo pontos e traço
      setError("Por favor, insira um CPF válido com 11 dígitos.");
      return;
    }

    if (!nome || !cpf || !login || !senha || !confirmarSenha || !roles) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    // Verifica se a senha tem pelo menos 8 caracteres, incluindo pelo menos um número e um caractere especial
    const senhaRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!senhaRegex.test(senha)) {
      setError("A senha deve ter pelo menos 8 caracteres, incluindo pelo menos um número e um caractere especial.");
      return;
    }

    try {
      const response = await api.post("/users", {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        login,
        senha,
        roles
      });
      console.log(response.data);
      setSuccessMessage("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setError("Erro ao cadastrar usuário. Por favor, tente novamente.");
    }
  };

  const voltarSubmit = () => {
    navigate("/dashboard");
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
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="CPF" value={cpf} onChange={(event) => formatarCPF(event.target.value)} />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Login" onChange={(event) => setLogin(event.target.value)} />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type={mostrarSenha ? "text" : "password"} placeholder="Senha" value={senha} onChange={(event) => setSenha(event.target.value)} />
            <button className="eye-icon" onClick={() => setMostrarSenha(!mostrarSenha)}>
              {mostrarSenha ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
            </button>
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type={mostrarConfirmarSenha ? "text" : "password"} placeholder="Confirmar senha" onChange={(event) => setConfirmarSenha(event.target.value)} />
            <button className="eye-icon" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
              {mostrarConfirmarSenha ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
            </button>
          </div>
          <div className="input">
              <label></label>
              <img src={user_icon} alt="" />
              <select className="select" value={roles} onChange={(event) => setRoles(event.target.value)}>
                  <option value="">Selecione</option>
                  <option value="1">Administrador</option>
                  <option value="2">Vendedor</option>
              </select>
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
