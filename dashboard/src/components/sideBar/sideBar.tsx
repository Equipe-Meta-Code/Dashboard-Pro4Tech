import "./Sidebar.scss";
//import { SidebarContext } from "../../context/SidebarContext";
//import { useContext, useRef, useEffect } from "react";
import { FaHome, FaEnvelope, FaUsers, FaDollarSign } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = () => {
  /*const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event:MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node) &&
      event.target instanceof Element && event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);*/

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
              <Link to="/" className="menu-link active">
                <span className="menu-link-icon">
                  <FaHome size={18} />
                </span>
                <span className="menu-link-text">Visão Geral</span>
              </Link>
            </li>
            {/*<li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <FaUsers size={18} />
                </span>
                <span className="menu-link-text">Vendedores</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <FaDollarSign size={18} />
                </span>
                <span className="menu-link-text">Vendas</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <FaEnvelope size={18} />
                </span>
                <span className="menu-link-text">Comissões</span>
              </Link>
            </li>*/}
          </ul>
        </div>

        <div className="sidebar-menu side-menu2">
          <ul className="menu-list">
            {/*<li className="menu-item">
              <Link to="/" className="menu-link">
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
