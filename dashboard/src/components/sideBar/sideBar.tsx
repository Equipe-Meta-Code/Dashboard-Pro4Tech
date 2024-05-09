import { useState } from "react";
import "./Sidebar.scss";
import { FaEnvelope, FaUsers } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdCloudUpload, MdWork, MdSell } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import PermissionComponent from "../PermissionComponent";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  
  const { signOut } = useAuth();

  const [fileInput, setFileInput] = useState(null);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleFileInputChange = (event) => {
    setFileInput(event.target.files[0]);
    setShowSendButton(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fileInput) {
      setModalMessage("Por favor, selecione um arquivo.");
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", fileInput);

    try {
      const response = await fetch("http://localhost:8080", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setModalMessage("Arquivo enviado com sucesso!");
        setShowModal(true);
        setFileInput(null);
        setShowSendButton(false);
      } else {
        setModalMessage("Erro ao enviar arquivo. Por favor, tente novamente.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      setModalMessage("Erro ao enviar arquivo. Por favor, tente novamente.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleLogout = () => {
    signOut(); 
  };

  return (
    <nav
      className="sidebar" /*{`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}*/
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="sidebar-brand-text">menu</span>
        </div>
        {/*<button className="sidebar-close-btn">
          <MdOutlineClose size={24} />
        </button>*/}
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/dashboard" className="menu-link">
                <span className="menu-link-icon">
                  <RiDashboardFill size={18} />
                </span>
                <span className="menu-link-text">Visão Geral</span>
              </Link>
            </li>
            <PermissionComponent role="Admin_Role">
                <li className="menu-item">
                  <Link to="/vendedores" className="menu-link">
                    <span className="menu-link-icon">
                      <MdWork size={18} />
                    </span>
                    <span className="menu-link-text">Vendedores</span>
                  </Link>
                </li>
            </PermissionComponent>
            <PermissionComponent role="Admin_Role">
                <li className="menu-item">
                  <Link to="/vendas" className="menu-link">
                    <span className="menu-link-icon">
                      <MdSell size={18} />
                    </span>
                    <span className="menu-link-text">Vendas</span>
                  </Link>
                </li>
            </PermissionComponent>
            <PermissionComponent role="Admin_Role">
                <li className="menu-item">
                  <Link to="/clientes" className="menu-link">
                    <span className="menu-link-icon">
                      <FaUsers size={18} />
                    </span>
                    <span className="menu-link-text">Clientes</span>
                  </Link>
                </li>
            </PermissionComponent>
            <PermissionComponent role="Admin_Role">
                <li className="menu-item">
                  <Link to="/comissoes" className="menu-link">
                    <span className="menu-link-icon">
                      <FaEnvelope size={16} />
                    </span>
                    <span className="menu-link-text">Comissões</span>
                  </Link>
                </li>
            </PermissionComponent>
          </ul>
        </div>

        <div className="sidebar-menu side-menu2">
          <ul className="menu-list">
            <PermissionComponent role="Admin_Role">
              <li className="menu-item">
                  <Link to="/cadastro" className="menu-link">
                    <span className="menu-link-icon">
                      <FaCircleUser size={17} />
                    </span>
                    <span className="menu-link-text">Cadastrar</span>
                  </Link>
              </li>
            </PermissionComponent>
            <li className="menu-item">
                  <Link to="/novaSenha" className="menu-link">
                    <span className="menu-link-icon">
                      <FaKey size={16} />
                    </span>
                    <span className="menu-link-text">Alterar Senha</span>
                  </Link>
                </li>
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>   
                  <span className="menu-link-icon">
                    <FaSignOutAlt size={16} />
                  </span>
                  <span className="menu-link-text">Sair</span>     
              </button>
            </li>
            <li className="menu-item">
              <form onSubmit={handleSubmit}>
                <label htmlFor="fileInput" className="menu-link">
                  <span className="menu-link-icon">
                    <MdCloudUpload size={18} />
                  </span>
                  <span className="menu-link-text">Upload</span>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                />
                {showSendButton && (
                  <button type="submit" className="menu-link">
                    <span className="menu-link-text">Enviar</span>
                  </button>
                )}
              </form>

              {showModal && (
                <div className="modal">
                  <div className="modal-content" style={{ color: "white" }}>
                    <p>{modalMessage}</p>
                    <button className="close-button" onClick={handleCloseModal}>
                      Atualizar
                    </button>
                  </div>
                </div>
              )}
            </li>
            {/*<li className="menu-item">
                <Link to="/settings" className="menu-link">
                  <span className="menu-link-icon">
                    <MdOutlineSettings size={20} />
                  </span>
                  <span className="menu-link-text">Settings</span>
                </Link>
            </li>*/}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
