import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./perfilVendedores.scss";
import AreaBarChartPerfil from "../dashboard/areaCharts/areaBarChartPerfil";
import AreaProgressChartPerfil from "../dashboard/areaCharts/areaProgressChartPerfil";
import { DateProvider } from "../../context/DateContext";
import AreaCards from "../dashboard/areaCards/areaCards";
import VendasVendedor from "./tabela/vendasVendedor";

const Perfil = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false); // estado para controlar se o modo de edição está ativado ou não
  const [vendedoresDetails, setVendedoresDetails] = useState({ // armazenar detalhes do vendedor
    name: "",
    cpf: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    photo: "",  
  });

  useEffect(() => {
    const fetchVendedorDetails = async () => {
      try {
        //const response = await axios.get(`http://localhost:8080/vendedores/${id}`);
        //setVendedoresDetails(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do vendedor:", error);
      }
    };

    fetchVendedorDetails();
  }, [id]);
  
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
    <DateProvider>
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
            <AreaBarChartPerfil vendedorSelecionado={id} />
          </div>
        </div>
        <div className="body">
          <div className="left">
           <AreaCards />
          </div>
          <div className="right">
            <AreaProgressChartPerfil vendedorSelecionado={id} />
          </div>
        </div>
        <div className="bottom">
          <VendasVendedor vendedorSelecionado={id} />
        </div>
      </div>
    </div>
    </DateProvider>
  );
};

export default Perfil;
