import { useState } from 'react';
import password_icon from '../../../assets/password.png';
import api from '../../../services/api';
import user_icon from '../../../assets/person.png';
import eyeOpen from "../../../assets/eyeOpen.png";
import eyeClose from "../../../assets/eyeClose.png";

const NovaSenha = () => {
    const [login, setLogin] = useState("");
    const [senhaAntiga, setSenhaAntiga] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [mostrarAntiga, setMostrarAntiga] = useState(false);
    const [mostrarNova, setMostrarNova] = useState(false);

    const handleSubmit = async () => {
        try {
            const response = await api.put(`/users/changePassword/${login}`, {
                senhaAntiga,
                novaSenha
            });
            console.log("eeei");
            setSuccessMessage(response.data.message);
            setErrorMessage("");
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(error.response.data.message);
        }
    };

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    };

    const handleSenhaAntigaChange = (event) => {
        setSenhaAntiga(event.target.value);
    };

    const handleNovaSenhaChange = (event) => {
        setNovaSenha(event.target.value);
    };

    return (
        <div className="container">
            <div className="title-label">Alterar senha</div>
            <div className="content">
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder="Insira seu Login" value={login} onChange={handleLoginChange} />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type={mostrarAntiga ? "text" : "password"} placeholder="Insira sua senha antiga" value={senhaAntiga} onChange={handleSenhaAntigaChange} />
                        <button className="eye-icon" onClick={() => setMostrarAntiga(!mostrarAntiga)}>
                        {mostrarAntiga ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
                        </button>
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type={mostrarNova ? "text" : "password"} placeholder="Insira sua senha nova" value={novaSenha} onChange={handleNovaSenhaChange} />
                        <button className="eye-icon" onClick={() => setMostrarNova(!mostrarNova)}>
                        {mostrarNova ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
                        </button>
                    </div>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="submit-container">
                    <div className="submit" onClick={handleSubmit}>Salvar</div>
                </div>
            </div>
        </div>
    );
};

export default NovaSenha;
