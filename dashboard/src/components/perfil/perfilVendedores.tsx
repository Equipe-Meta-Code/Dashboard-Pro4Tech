import "./perfilVendedores.scss";
import AreaBarChart from "../dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../dashboard/areaCharts/areaProgressChart";
import AreaCards from "../dashboard/areaCards/areaCards";
import VendasVendedor from "./tabela/vendasVendedor";

const Perfil = () => {
  return (
    <div className="perfil">
      <div className="perfilContainer">
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Informações</h1>
            <div className="item">
              <img
                src="https://ogimg.infoglobo.com.br/in/25149803-9ab-ac0/FT1086A/beyonce-2.jpg"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">Fernanda Carvalho</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">fernanda@gmail.com</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">CPF:</span>
                  <span className="itemValue">121.222.121-22</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Telefone:</span>
                  <span className="itemValue">+55 (12) 10101-11111</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Endereço:</span>
                  <span className="itemValue">Rua Tal, 400</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">País:</span>
                  <span className="itemValue">Brasil</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <AreaBarChart/>
          </div>
        </div>
        <div className="body">
          <div className="left">
            <AreaCards/>
          </div>
          <div className="right">
            <AreaProgressChart/>
          </div>
        </div>
        <div className="bottom">
          <VendasVendedor/>
        </div>
      </div>
    </div>
  );
};

export default Perfil;