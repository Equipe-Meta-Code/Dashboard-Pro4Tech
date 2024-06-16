import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ModalPerfil from "../pages/modal/modalPerfil";
import InputMask from 'react-input-mask';
import calendario from '../../assets/icons/calendario.svg';
import "./perfilVendedores.scss";
import AreaProgressChartPerfil from "../dashboard/areaCharts/areaProgressChartPerfil";
import { DateProvider } from "../../context/DateContext";
import VendasVendedor from "./tabela/vendasVendedor";
import AreaBarChartPerfil from "../dashboard/areaCharts/areaBarChartPerfil";
import { AreaTop } from "../index";
import perfilsemfoto from "./perfilsemfoto.jpg"

const Perfil = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [vendedoresDetails, setVendedoresDetails] = useState({
    Vendedor: "",
    CPF_Vendedor: "",
    Data_Nascimento: "",
    Email: "",
    Telefone: "",
    Endereco: "",
    Pais: "",
    foto: "",
    id: "",
  });

  const fetchData = async () => {
    try {
      let response = await axios.get('http://localhost:8080/vendedor', {
        params: { vendedor: id }
      });

      const dataVendedores = response.data[0];
      setVendedoresDetails(dataVendedores);
      console.log("v",vendedoresDetails.CPF_Vendedor)
      await setCPF_Vendedor(vendedoresDetails.CPF_Vendedor)
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [id]);

    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
  
    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
  
    const uploadImage = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('image', image);
  
      const headers = {
        'headers': {
          'Content-Type': 'multipart/form-data'
        }
      }
      if (image) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          if (typeof result === "string") {
            setFotoEditando(result)
          }
        };
        reader.readAsDataURL(image);
      }
  
/*       try {
        
        const response = await axios.put('http://localhost:8080/upload-image', formData);
        setMessage(response.data.message);
      } catch (err) {
        if (err.response) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Erro: Tente novamente mais tarde ou entre contato com ...!");
        }
      } */



    };

  /* const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        if (typeof result === "string") {
          setVendedoresDetails((prevState) => ({
            ...prevState,
            foto: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = (e) => {
    const foto = e.target.files[0];
    if (foto) {
      const formData = new FormData();
        formData.append("foto", foto);

        fetch("http://localhost:8080/upload-image", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setVendedoresDetails((prevState) => ({
                ...prevState,
                foto: data.filePath, // Salvar o caminho da imagem retornado pelo backend
            }));
        })
        .catch(error => {
            console.error("Erro ao fazer upload da imagem:", error);
        });
    }}
 */

  const [Vendedor, setVendedor] = useState('');
  const [CPF_Vendedor, setCPF_Vendedor] = useState('');
  const [Email, setEmail] = useState('');
  const [Telefone, setTelefone] = useState('');
  const [Endereco, setEndereco] = useState('');
  const [Pais, setPais] = useState('');
  const [data_Nascimento, setData_Nascimento] = useState('');
  const [foto, setFoto] = useState('');
  const [fotoEditando, setFotoEditando] = useState('');
  

  const handleEditar = async (Vendedor, CPF_Vendedor,Email,Telefone, Endereco, Pais, fotoEditando) => {
    try {
      await fetchData()
      console.log("handleEditar", CPF_Vendedor)
      const newData = {
      Vendedor: Vendedor,
      CPF_Vendedor: CPF_Vendedor,
      Email: Email,
      Telefone: Telefone,
      Endereco: Endereco,
      Pais: Pais,
      foto: fotoEditando,
      };
      console.log("Adicionando Venda")
      console.table(newData);
      // Envia uma requisição POST para o endpoint adequado no backend para adicionar os dados
      setOpenModal(false);
      await axios.put('http://localhost:8080/vendedores_editando', newData);
      await fetchData();
      //.location.reload();
    } catch (error) {
      console.error("Erro ao adicionar vendedor:", error);
    }
  };

  const abrirModal = async () => {
    await fetchData()
    setOpenModal(true)
    setVendedor(vendedoresDetails.Vendedor)
    setEmail(vendedoresDetails.Email)
    setTelefone(vendedoresDetails.Telefone)
    setEndereco(vendedoresDetails.Endereco)
    setPais(vendedoresDetails.Pais)
    setFoto(vendedoresDetails.foto)
    //setData_Nascimento(vendedoresDetails.Data_Nascimento)

  };

  return (
    <DateProvider>
      <div className="perfil">
        <div className="perfilContainer">
          <div className="top">
            <div className="left">
              <button className="editButton" onClick={() => abrirModal()}>
                Editar
              </button>
              <h1 className="title">Informações</h1>
              <div className="item">
                <img src={vendedoresDetails.foto || perfilsemfoto} alt="Foto de Perfil" className="itemImg" />
                {isEditing && (
                   <input
                    type="file"
                    accept="image/*"
                  />
                )}
                <div className="details">
                      <h1 className="itemTitle">{vendedoresDetails.Vendedor}</h1>
                      <div className="detailItem">
                        <span className="itemKey">CPF:</span>
                        <span className="itemValue">{vendedoresDetails.CPF_Vendedor}</span>
                      </div>

                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{vendedoresDetails.Email}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Telefone:</span>
                        <span className="itemValue">{vendedoresDetails.Telefone}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Endereço:</span>
                        <span className="itemValue">{vendedoresDetails.Endereco}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">País:</span>
                        <span className="itemValue">{vendedoresDetails.Pais}</span>
                      </div>
                </div>
              </div>
            </div>
            <div className="center">
              <AreaTop />
            </div>
            <div className="right">
              <AreaBarChartPerfil vendedorSelecionado={id} />
            </div>
          </div>
          <div className="body">
            <div className="right">
              <AreaProgressChartPerfil vendedorSelecionado={id} />
            </div>
          </div>
          <div className="bottom">
            <VendasVendedor vendedorSelecionado={id} />
          </div>
        </div>
      </div>
      <ModalPerfil isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)}> 
            <div className="container-modalVendas">
              <div className="title-modalVendas">Editar Vendedor</div>
              <div className="content-modalVendas"> 
                  <div className="inputs-modalVendas">

                    <div className="input-modalVendas">
                    <form onSubmit={uploadImage}>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                      <button type="submit">Upload</button>
                    </form>
                    {message && <p>{message}</p>}
                    </div>

                    <div className="input-modalVendas">
                      <input type="text" placeholder="Vendedor" value={Vendedor}onChange={event => setVendedor(event.target.value)}/>
                    </div>
                    <div className="input-modalVendas">
                      <input type="text" placeholder="E-mail" value={Email}onChange={event => setEmail(event.target.value)}/>
                    </div>
                    <div className="input-modalVendas">
                      <InputMask
                        mask="(99) 99999-9999"
                        value={Telefone}
                        onChange={event => setTelefone(event.target.value)}
                      >
                        {() => <input type="text" placeholder="Telefone" />}
                      </InputMask>
                    </div>
                    <div className="input-modalVendas">
                      <input type="text" placeholder="Endereço" value={Endereco}onChange={event => setEndereco(event.target.value)}/>
                    </div>
                    <div className="input-modalVendas">
                      <input type="text" placeholder="País" value={Pais}onChange={event => setPais(event.target.value)}/>
                    </div>
                    
                  </div>
                  <div className="submit-container-modalVendas">
                    <div className="submit-modalVendas" onClick={() => handleEditar(Vendedor,CPF_Vendedor, Email, Telefone, Endereco, Pais, fotoEditando)}>Salvar</div>
                  </div>

              </div>
            </div>      
        </ModalPerfil>
    </DateProvider>
  );
};

export default Perfil;
