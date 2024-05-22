import { useState } from "react";
import "./perfilVendedores.scss";
import AreaBarChart from "../dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../dashboard/areaCharts/areaProgressChart";
import AreaCards from "../dashboard/areaCards/areaCards";
import VendasVendedor from "./tabela/vendasVendedor";

//http://localhost:5173/perfil
const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false); // estado para controlar se o modo de edição está ativado ou não
  const [vendedoresDetails, setVendedoresDetails] = useState({ // armazenar detalhes do vendedor
    name: "Fernanda Carvalho",
    cpf: "121.222.121-22",
    email: "fernanda@gmail.com",
    phone: "+55 (12) 10101-11111",
    address: "Rua Tal, 400",
    country: "Brasil",
    photo:
      "https://ogimg.infoglobo.com.br/in/25149803-9ab-ac0/FT1086A/beyonce-2.jpg",
  });

  // função para lidar com mudanças nos campos de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendedoresDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // mudança da foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        if (typeof result === "string") {
          setVendedoresDetails((prevState) => ({
            ...prevState,
            photo: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // alternar o modo de edição
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="perfil">
      <div className="perfilContainer">
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={toggleEditMode}>
              {isEditing ? "Save" : "Edit"}
            </div>
            <h1 className="title">Informações</h1>
            <div className="item">
              <img src={vendedoresDetails.photo} alt="" className="itemImg" /> 
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              )}
              <div className="details">
                {isEditing ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Nome:</span>
                      <input
                        type="text"
                        name="name"
                        value={vendedoresDetails.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">CPF:</span>
                      <input
                        type="text"
                        name="cpf"
                        value={vendedoresDetails.cpf}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <input
                        type="email"
                        name="email"
                        value={vendedoresDetails.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Telefone:</span>
                      <input
                        type="text"
                        name="phone"
                        value={vendedoresDetails.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Endereço:</span>
                      <input
                        type="text"
                        name="address"
                        value={vendedoresDetails.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">País:</span>
                      <input
                        type="text"
                        name="country"
                        value={vendedoresDetails.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="itemTitle">{vendedoresDetails.name}</h1>
                    <div className="detailItem">
                      <span className="itemKey">CPF:</span>
                      <span className="itemValue">{vendedoresDetails.cpf}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">
                        {vendedoresDetails.email}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Telefone:</span>
                      <span className="itemValue">
                        {vendedoresDetails.phone}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Endereço:</span>
                      <span className="itemValue">
                        {vendedoresDetails.address}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">País:</span>
                      <span className="itemValue">
                        {vendedoresDetails.country}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <AreaBarChart />
          </div>
        </div>
        <div className="body">
          <div className="left">
            <AreaCards />
          </div>
          <div className="right">
            <AreaProgressChart />
          </div>
        </div>
        <div className="bottom">
          <VendasVendedor />
        </div>
      </div>
    </div>
  );
};

export default Perfil;
