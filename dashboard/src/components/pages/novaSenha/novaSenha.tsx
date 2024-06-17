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
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [mostrarAntiga, setMostrarAntiga] = useState(false);
    const [mostrarNova, setMostrarNova] = useState(false);
    const [mostrarConfirma, setMostrarConfirma] = useState(false);

    const isCPF = (strCPF) => {
        var Soma;
        var Resto;
        Soma = 0;
        if (strCPF === "00000000000") return false;

        for (let i = 1; i <= 9; i++) Soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if (Resto === 10 || Resto === 11) Resto = 0;
        if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if (Resto === 10 || Resto === 11) Resto = 0;
        if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
        return true;
    };

    const handleLoginChange = (e) => {
        const valor = e.target.value;
        const isNumeric = /^\d+$/.test(valor);
        if (isNumeric && valor.length <= 11) {
            const cpf = formatarCPF(valor);
            setLogin(cpf);
        } else {
            setLogin(valor);
        }
    };

    const formatarCPF = (valor) => {
        const cpf = valor.replace(/\D/g, '').slice(0, 11);
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const handleSenhaAntigaChange = (e) => {
        const valor = e.target.value;
        const isNumeric = /^\d+$/.test(valor);
        if (isNumeric && valor.length <= 11) {
            const cpf = formatarCPF(valor);
            setSenhaAntiga(cpf);
        } else {
            setSenhaAntiga(valor);
        }
    };

    const handleSubmit = async () => {
        try {
            // Validar se todos os campos estão preenchidos
            if (!login || !senhaAntiga || !novaSenha || !confirmarSenha) {
                throw new Error("Por favor, preencha todos os campos.");
            }

            // Validar a nova senha
            if (novaSenha.length < 8 || !/\d/.test(novaSenha) || !/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)) {
                throw new Error("A nova senha deve ter no mínimo 8 caracteres, pelo menos 1 número e 1 caractere especial.");
            }

            // Verificar se a nova senha e a confirmação são iguais
            if (novaSenha !== confirmarSenha) {
                throw new Error("A nova senha e a confirmação de senha não são iguais.");
            }


            // Fazer a requisição para a API com os dados do formulário
            const response = await api.put('/updatePassword', {
                login,
                senhaAntiga,
                novaSenha
            });
            
            // Limpar mensagens de erro/sucesso anteriores
            setErrorMessage("");
            setSuccessMessage("Senha atualizada com sucesso");

            // Limpar campos do formulário após sucesso
            setLogin("");
            setSenhaAntiga("");
            setNovaSenha("");
            setConfirmarSenha("");
        } catch (error) {
            // Tratar erros da requisição
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.message);
            }
        }
    };

    return (
        <div className="container">
            <div className="title-label">Alterar senha</div>
            <div className="content">
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder="Insira seu login" value={login} onChange={handleLoginChange} />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type={mostrarAntiga ? "text" : "password"} placeholder="Insira sua senha atual" value={senhaAntiga} onChange={handleSenhaAntigaChange} />
                        <button className="eye-icon" onClick={() => setMostrarAntiga(!mostrarAntiga)}>
                            {mostrarAntiga ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
                        </button>
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type={mostrarNova ? "text" : "password"} placeholder="Insira sua nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        <button className="eye-icon" onClick={() => setMostrarNova(!mostrarNova)}>
                            {mostrarNova ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
                        </button>
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type={mostrarConfirma ? "text" : "password"} placeholder="Confirme sua nova senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                        <button className="eye-icon" onClick={() => setMostrarConfirma(!mostrarConfirma)}>
                            {mostrarConfirma ? <img src={eyeOpen} alt="Mostrar senha" /> : <img src={eyeClose} alt="Esconder senha" />}
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
