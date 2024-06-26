import * as React from "react";
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FaRegEdit } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { CiEraser } from "react-icons/ci";
import { TfiEraser } from "react-icons/tfi";
import { MdAdd} from "react-icons/md";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import axios from "axios";

import ModalVendas from "../modal/modalVendas";
import calendario from '../../../assets/icons/calendario.svg';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerCustomStyles.scss";
import moment from 'moment';
import numeral from 'numeral';
import user_icon from '../../../assets/person.png'

registerLocale("pt", pt);
setDefaultLocale("pt");

const Vendas = () => {

  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);
  const [chartVendedores, setChartVendedores] = useState([]);
  const [chartClientes, setChartClientes] = useState([]);
  const [chartProdutos, setChartProdutos] = useState([]);
  
  useEffect(() => {
    fetchData();
    fetchVendedores();
    fetchClientes(); // Adicionando busca por clientes
    fetchProdutos();
  }, []);

  useEffect(() => {
    setRows(chartData);
    setInitialRows(chartData);
  }, [chartData]);
 
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/geral');
      const data = response.data;
      // Pré-processamento para pegar apenas os dois primeiros nomes de cada vendedor
      
      const processedData = data.map(item => ({
        id: item.id,
        venda: item.tipoVendaGeral,
        vendedor: item.Vendedor.split(' ').slice(0, 2).join(' '),
        cpf: item.CPF_Vendedor,
        cliente: item.Cliente.split(' ').slice(0, 2).join(' '),
        cpfCliente: item.CNPJ_CPF_Cliente,
        segmento: item.Segmento_do_Cliente,
        produto: item.Produto,
        idProduto: item.ID_Produto,
        data: item.Data_da_Venda,
        valor: item.Valor_de_Venda,
        pagamento: item.Forma_de_Pagamento
        
      }));
      setChartData(processedData)
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Função para buscar os vendedores disponíveis
  const fetchVendedores = async () => {
    try {
      const response = await axios.get('http://localhost:8080/vendedores');
      const vendedores = response.data;

    const processedVendedores = vendedores.map(item => ({
      value: item.Vendedor.split(' ').slice(0, 2).join(' '),
      cpf: item.CPF_Vendedor,
      label: `${item.Vendedor.split(' ').slice(0, 2).join(' ')}`,
    }));

      
      // Atualizando o state com os vendedores disponíveis
      setChartVendedores(processedVendedores);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
    }
  };

  // Função para buscar os clientes disponíveis
const fetchClientes = async () => {
  try {
    const response = await axios.get('http://localhost:8080/clientes');
    const clientes = response.data;

    const processedClientes = clientes.map(item => ({
      value: item.Cliente.split(' ').slice(0, 2).join(' '),
      cpf: item.CNPJ_CPF_Cliente,
      segmento: item.Segmento_do_Cliente,
      label: `${item.Cliente.split(' ').slice(0, 2).join(' ')}`,
    }));

    // Atualizando o state com os clientes disponíveis
    setChartClientes(processedClientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
};

const fetchProdutos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/produtos');
    const produtos = response.data;

    const processedProdutos = produtos.map(item => ({
      value: item.Produto,
      valor: item.Valor_de_Venda,
      idProduto: item.id,
      label: `${item.Produto}`,
    }));

    // Atualizando o state com os produtos disponíveis
    setChartProdutos(processedProdutos);
  } catch (error) {
    console.error('Erro ao buscar Produtos:', error);
  }
};

const saveChangesToDatabase = async (updatedRows: GridRowModel[]) => {
  try {
    console.log('Chamando função saveChangesToDatabase');

    // Busca todos os clientes e armazena os dados localmente
    const resClientes = await axios.get('http://localhost:8080/clientes');
    const clientes = resClientes.data;

    // Mapeia os dados atualizados para o formato esperado pelo backend
    const updatedData = updatedRows.map(row => {
      // Busca o cliente correspondente pelo CPF
      const cliente = clientes.find(c => c.CNPJ_CPF_Cliente === row.cpfCliente);
      const segmentoDoCliente = cliente ? cliente.Segmento_do_Cliente : 'Não encontrado';
      

      // Cria o objeto rowData com os dados necessários
      return {
        id: row.id,
        Vendedor: row.vendedor,
        CPF_Vendedor: row.cpf,
        Cliente: row.cliente,
        CNPJ_CPF_Cliente: row.cpfCliente,
        Valor_de_Venda: row.valor,
        Forma_de_Pagamento: row.pagamento,
        Segmento_do_Cliente: segmentoDoCliente,
        Produto: row.produto,
        ID_Produto: row.idProduto,//Colocar no app.js o Produto,ID_Produto
      };
    });

    // Envia uma requisição PUT para o endpoint adequado no backend para realizar o update
    console.log("Updated Data OBJ: ", updatedData);
    await axios.put('http://localhost:8080/vendas_update', updatedData);
    console.log("Dados atualizados com sucesso!");
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
};


  //adicionar na tabela
  interface EditToolbarProps {
    setRows: (newRows: GridRowModel[]) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
    rows: GridRowsProp;
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, rows } = props;

    const handleClick = () => {
      //calcula o próximo ID baseado no maior ID existente na tabela
      const nextId = Math.max(...rows.map((row) => row.id), 0) + 1;

      const newRows = [
        { id: nextId, venda: "", vendedor: "", isNew: true },
        ...rows, //adiciona a nova linha no início do array
      ];

      setRows(newRows);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [nextId]: { mode: GridRowModes.Edit, fieldToFocus: "venda" },
      }));
    };

    const handleAdicionar = async (Data_da_Venda, Vendedor, CPF_Vendedor, Produto, Cliente, CNPJ_CPF_Cliente, Valor_de_Venda, Forma_de_Pagamento,Segmento_do_Cliente,ID_Produto ) => {
      try {
       
        const dataVenda = moment(Data_da_Venda, 'DD/MM/YYYY');
     
        if (!dataVenda.isValid()) {
          throw new Error('Data_da_Venda inválida');
        }
 
        const dataFormatada = dataVenda.format('YYYY-MM-DD');
       
        const newData = {
          Data_da_Venda: dataFormatada, // Convertendo a data para o tipo DATE
          Vendedor: Vendedor,
          CPF_Vendedor: CPF_Vendedor,
          Produto: Produto,
          ID_Produto: ID_Produto,
          Cliente: Cliente,
          CNPJ_CPF_Cliente: CNPJ_CPF_Cliente,
          Segmento_do_Cliente: Segmento_do_Cliente,
          Valor_de_Venda: Valor_de_Venda,
          Forma_de_Pagamento: Forma_de_Pagamento,
        };
        console.log("Adicionando Venda")
        console.table(newData);

        /* console.log("DATA", Data_da_Venda);
        console.log("Vendedor", Vendedor);
        console.log("CPF DO Vendedor", CPF_Vendedor);
        console.log("Produto",Produto);
        console.log("ID_Produto", "id");
        console.log("Cliente", Cliente);
        console.log("CPF DO CLIENTE", CNPJ_CPF_Cliente);
        console.log("Segmento", "Segmento")
        console.log("Forma de pagamento", Forma_de_Pagamento);
        console.log("Valor", Valor_de_Venda); */

    
        // Envia uma requisição POST para o endpoint adequado no backend para adicionar os dados
        setOpenModal(false);
        await axios.post('http://localhost:8080/vendas_adicionar', newData);
        
        window.location.reload();
      } catch (error) {
        console.error("Erro ao adicionar vendedor:", error);
      }
      
    };
    
    const [openModal, setOpenModal] = useState(false)
    const [Data_da_Venda, setData_da_Venda] = useState('');
    const [Vendedor, setVendedor] = useState('');
    const [CPF_Vendedor, setCPF_Vendedor] = useState('');
    const [Produto, setProduto] = useState('');
    const [ID_Produto, setID_Produto] = useState('');
    const [Cliente, setCliente] = useState('');
    const [CNPJ_CPF_Cliente, setCNPJ_CPF_Cliente] = useState('');
    const [Segmento_do_Cliente, setSegmento_do_Cliente] = useState('');
    const [Valor_de_Venda, setValor_de_Venda] = useState('');
    const [Forma_de_Pagamento, setForma_de_Pagamento] = useState('');
   /*  const [selectedVendedor, setSelectedVendedor] = useState(''); */

   const [filter, setFilter] = useState("");
   const [data, setData] = useState("");
   const [selectedOption, setSelectedOption] = useState('');
   const [selectedOptionModal, setSelectedOptionModal] = useState(''); 
   const [mask, setMask] = useState('');
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);

   const applyFilter = () => {

    if(selectedOption === 'vendedor'){
      const inputValue = filter;
      const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
      const hasReachedCPFLength = numericValue.length === 11;

      if (hasReachedCPFLength) {
        // Se o usuário digitou 11 dígitos, aplica a máscara de CPF
        const filteredRows = chartData.filter((row) => {
          // Verifica se o CPF começa com o filtro
          const cpfMatchesFilter = row.cpf.startsWith(filter);
        
          // Se startDate e endDate estiverem definidos, verifica se a data da venda está dentro do período selecionado
          if (startDate && endDate) {
            const saleDate = new Date(row.data); // Supondo que 'data' seja o nome da coluna que contém a data da venda
            return cpfMatchesFilter && saleDate >= startDate && saleDate <= endDate;
          }
        
          // Se startDate e endDate não estiverem definidos, retorna apenas se o CPF coincide com o filtro
          return cpfMatchesFilter;
        });
        setRows(filteredRows);
      } else {
        // Se ainda não digitou 11 dígitos, não aplica a máscara
        const filteredRows = chartData.filter((row) => {
          // Verifica se o nome do vendedor começa com o filtro (insensível a maiúsculas e minúsculas)
          const vendedorMatchesFilter = row.vendedor.toLowerCase().startsWith(filter.toLowerCase());
        
          // Se startDate e endDate estiverem definidos, verifica se a data da venda está dentro do período selecionado
          if (startDate && endDate) {
            const saleDate = new Date(row.data); // Supondo que 'data' seja o nome da coluna que contém a data da venda
            return vendedorMatchesFilter && saleDate >= startDate && saleDate <= endDate;
          }
        
          // Se startDate e endDate não estiverem definidos, retorna apenas se o nome do vendedor coincide com o filtro
          return vendedorMatchesFilter;
        });
        
        
        setRows(filteredRows);
      }
    };
    

    if(selectedOption === 'cliente'){
      const inputValue = filter;
      console.log(filter)
      const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
      const hasReachedCNPJLength = numericValue.length === 14;

      if (hasReachedCNPJLength) {
        // Se o usuário digitou 14 dígitos, aplica a máscara de CNPJ 
        const filteredRows = chartData.filter((row) => {
          const cpfMatchesFilter = row.cpfCliente.startsWith(filter);
          
          if (startDate && endDate) {
            const saleDate = new Date(row.data); // Supondo que 'data' seja o nome da coluna que contém a data da venda
            return cpfMatchesFilter && saleDate >= startDate && saleDate <= endDate;
          }
          return cpfMatchesFilter;
        });
        setRows(filteredRows);
      } else {
        // Se ainda não digitou 11 dígitos, não aplica a máscara
        const filteredRows = chartData.filter((row) => {
          const clienteMatchesFilter = row.cliente.toLowerCase().startsWith(filter.toLowerCase());

          if (startDate && endDate) {
            const saleDate = new Date(row.data); // Supondo que 'data' seja o nome da coluna que contém a data da venda
            return clienteMatchesFilter && saleDate >= startDate && saleDate <= endDate;
          }
          return clienteMatchesFilter;
        });
        
        setRows(filteredRows);
      }
    }
    if (selectedOption === 'data') {
      const filteredRows = chartData.filter(row => {
        

        if (startDate && endDate) {
          const saleDate = new Date(row.data); 
          return saleDate >= startDate && saleDate <= endDate;
        }
        
      });
      setRows(filteredRows);
    }

  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const limparFiltro = async () => {
    setRows(chartData)
    setFilter('')
    setMask('')
    setStartDate('')
    setEndDate('')
   }
   //botão de adicionar vendas - arrumar com chat gpt ainda
   return (

    <div>
    <GridToolbarContainer>
      <Button className="text-button"
        startIcon={<MdAdd size={20} className="edit-button"/>}
        onClick={() => setOpenModal(true)}>Adicionar
      </Button>
        <ModalVendas isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)}> 
            <div className="container-modalVendas">
              <div className="title-modalVendas">Adicionar Vendas</div>
              <div className="content-modalVendas"> 
                  <div className="inputs-modalVendas">

                    <div className="input-modalVendas">
                      <select value={Vendedor} onChange={(event) => {
                        setVendedor(event.target.value); // Define o valor do vendedor
                        setCPF_Vendedor(event.target.selectedOptions[0].getAttribute("data-cpf")); // Define o CPF do vendedor
                      }}>
                        <option value="">Selecione um vendedor</option>
                        {chartVendedores.map((vendedor) => (
                          <option key={vendedor.value} value={vendedor.value} data-cpf={vendedor.cpf}>{vendedor.label} - {vendedor.cpf}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-modalVendas">
                      <select value={Cliente} onChange={(event) => {
                        setCliente(event.target.value); // Define o valor do cliente
                        const selectedOption = event.target.selectedOptions[0];
                        setCNPJ_CPF_Cliente(selectedOption.getAttribute("data-cpf")); // Define o CPF do cliente
                        setSegmento_do_Cliente(selectedOption.getAttribute("data-segmento")); // Define o segmento do cliente
                      }}>
                        
                        <option value="">Selecione um cliente</option>
                        {chartClientes.map((cliente) => (
                          <option key={cliente.value} value={cliente.value} data-cpf={cliente.cpf} data-segmento={cliente.segmento}>{cliente.label} - {cliente.cpf}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-modalVendas">
                      <select value={Produto} onChange={(event) => {
                        setProduto(event.target.value); 
                        const selectedOption = event.target.selectedOptions[0];
                        setValor_de_Venda(selectedOption.getAttribute("data-valor")); 
                        setID_Produto(selectedOption.getAttribute("data-idProduto"));
                     }}>
                        <option value="">Selecione um produto</option>
                        {chartProdutos.map((produto) => (
                          <option key={produto.value} value={produto.value} data-valor={produto.valor} data-idProduto={produto.idProduto}>{produto.label} - {produto.valor}</option>
                        ))}f
                      </select>
                    </div>


                    <div className="input-modalVendas"> 
                        <img src={calendario} alt="" />
                        <InputMask
                          mask="99/99/9999"
                          value={Data_da_Venda}
                          onChange={event => setData_da_Venda(event.target.value)}
                          placeholder="DD/MM/AAAA"
                        />
                      </div>

                    {/* <div className="input-modalVendas">
                      <input type="text" placeholder="Produto" onChange={event => setProduto(event.target.value)}/>
                    </div>

                    <div className="input-modalVendas">
                      <input type="text" placeholder="Valor da Venda" onChange={event => setValor_de_Venda(event.target.value)}/>
                    </div> */}

                    <div className="input-modalVendas">
                      <select value={Forma_de_Pagamento} onChange={event => setForma_de_Pagamento(event.target.value)}>
                        <option value="">Selecione a forma de pagamento</option>
                        <option value="Á vista">Á vista</option>
                        <option value="Parcelado">Parcelado</option>
                      </select>
                    </div>

                  </div>

                  <div className="submit-container-modalVendas">
                    <div className="submit-modalVendas" onClick={() => handleAdicionar(Data_da_Venda, Vendedor, CPF_Vendedor, Produto, Cliente, CNPJ_CPF_Cliente, Valor_de_Venda, Forma_de_Pagamento, Segmento_do_Cliente,ID_Produto)}>Adicionar</div>
                  </div>

              </div>
            </div>      
        </ModalVendas>
        <div className="inputs-filtros" >
          <div className="inputs-selection">
            <select
                  style={{
                    width: "315px",
                    padding: "12px",
                    borderRadius: "5px",
                    backgroundColor: "var(--chart-secondary-color)",
                    color: "var(--side-text-color3)",
                    fontSize: "16px" // Aumenta o tamanho do texto
                  }}
              onChange={event => setSelectedOption(event.target.value)}
            >
              <option value="" style={{ fontSize: "16px" }}>Selecione uma opção</option>
              <option value="vendedor" style={{ fontSize: "16px" }}>Vendedor</option>
              <option value="cliente" style={{ fontSize: "16px" }}>Cliente</option>
              <option value="data" style={{ fontSize: "16px" }}>Data</option>
            </select>

            <button onClick={limparFiltro} title="Apagar Filtro">
                <TfiEraser size={26} className="limpar-button" />
            </button>
          </div>
          
          {selectedOption === 'vendedor' && (
            <div className="inputs-filtros">
              <div className="input-filtro">
                <img src={user_icon} alt="" />
                <InputMask
                  mask={mask}
                  type="text"
                  placeholder="Busque por nome ou cpf do Vendedor"
                  value={filter}
                  onChange={event => {
                    const inputValue = event.target.value;
                    const firstChar = inputValue.charAt(0);
                    const isNumeric = !isNaN(firstChar); // Verifica se o primeiro caractere é um número
                    const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
                    const hasReachedCPFLength = numericValue.length === 11;
                                
                    if (isNumeric) {
                      // Se o primeiro caractere for um número e o usuário digitou 11 dígitos, aplica a máscara de CPF
                      setMask('999.999.999-99');
                      console.log('É um número e tem 11 dígitos');
                    } else if(!isNumeric) {
                      // Se não for um número ou não digitou 11 dígitos, não aplica a máscara
                      setMask('');
                    }
                                
                    setFilter(inputValue); // Atualiza o filtro conforme o usuário digita
                  }}
                />
              </div>

              <div className="input-filtro-data">
                <img src={calendario} alt="" />
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Data de início"
                  dateFormat="dd/MM/yyyy"
                  locale="pt"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                />
              </div>
              <div className="input-filtro-data">
                <img src={calendario} alt="" />
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Data final"
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  locale="pt"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                />
              </div>

              <button onClick={applyFilter}>
                <IoSearchSharp size={26} className="filtro-button" title="Buscar"/>
              </button>
            </div>
          )}

          {selectedOption === 'cliente' && (
            <div className="inputs-filtros" >
              <div className="input-filtro">
                <img src={user_icon} alt="" />
                <InputMask
                  mask={mask}
                  type="text"
                  placeholder="Busque por nome ou cnpj do Cliente"
                  value={filter}
                  onChange={event => {
                    const inputValue = event.target.value;
                    const firstChar = inputValue.charAt(0);
                    const isNumeric = !isNaN(firstChar); // Verifica se o primeiro caractere é um número
                    const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos

                    if (isNumeric) {
                      // Se o primeiro caractere for um número e o usuário digitou 11 dígitos, aplica a máscara de CPF
                      setMask('99.999.999/9999-99');
                    } else if(!isNumeric) {
                      // Se não for um número ou não digitou 11 dígitos, não aplica a máscara
                      setMask('');
                    }
                    
                    setFilter(inputValue); // Atualiza o filtro conforme o usuário digita
                  }}
                />
              </div>
              <div className="input-filtro-data">
                <img src={calendario} alt="" />
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Data de início"
                  dateFormat="dd/MM/yyyy"
                  locale="pt"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                />
              </div>
              <div className="input-filtro-data">
                <img src={calendario} alt="" />
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Data final"
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  locale="pt"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                />
              </div>

              <button onClick={applyFilter}>
                <IoSearchSharp size={26} className="filtro-button" title="Buscar"/>
              </button>
            </div>
          )}
          {selectedOption === 'data' && (
            <div className="inputs-filtros">
              <div className="input-filtro-data">
                <img src={calendario} alt="" />
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Data de início"
                  dateFormat="dd/MM/yyyy"
                  locale="pt"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                />
              </div>
              <div className="input-filtro-data">
                <img src={calendario} alt="" />
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Data final"
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  locale="pt"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                />
              </div>

              <button onClick={applyFilter}>
                <IoSearchSharp size={26} className="filtro-button" title="Buscar"/>
              </button>
          </div>
          )}

        </div>
    </GridToolbarContainer>

    
    
    </div>
  );
  
}

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  //função que interrompe a edição da linha quando o foco sai dela
  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  //alterar para modo edição da linha quando o botão for clicado
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    fetchVendedores();
  };

  //alterar para modo visualização da linha quando o botão de salvar for clicado
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  //ignorar modificações feitas na linha e voltar para modo visualização quando botão cancelar for clicado
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    //remover linha se ela for nova e o botão cancelar edição for clicado
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  //atualizar quando a linha nova for salva
  const processRowUpdate = async (newRow: GridRowModel) => {

    const { id, vendedor, cpf,cliente, cpfCliente, valor, pagamento, data, produto, idProduto } = newRow;
    const updatedRow = { ...newRow, isNew: false };
    // Chama a função para salvar as mudanças no banco de dados, passando o CPF selecionado
    await saveChangesToDatabase([{ id, vendedor, cpf, cliente, cpfCliente, valor, pagamento, data, produto, idProduto }]);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
  

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 20,
    },
    {
      field: "venda",
      headerName: "Venda",
      headerClassName: "super-app-theme--header",
      width: 220,
      editable: true,
    },
    {
      field: "vendedor",
      headerName: "Vendedor",
      headerClassName: "super-app-theme--header",
      width: 270,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;
    
        if (isInEditMode) {
          return (
            <select className="editar-venda"
              style={{
                width: "100%",
                height: "100%",
                //padding: "8px",
                borderRadius: "5px",
                backgroundColor: "var(--chart-secondary-color)",
                color: "var(--side-text-color3)",
                fontSize: "15px"
              }}
              value={params.value}
              onChange={(e) => {
                const newValue = e.target.value;
                const cpf = e.target.options[e.target.selectedIndex].dataset.cpf; // Obtenha o CPF do vendedor selecionado
                const id = params.row.id;
                const updatedRows = rows.map((row) => {
                  if (row.id === id) {
                    return { ...row, vendedor: newValue, cpf: cpf }; // Inclua o CPF na atualização
                  }
                  return row;
                });
                setRows(updatedRows);
              }}
              
              
            >
              {chartVendedores.map((option) => (
              <option key={option.id} value={option.value} data-cpf={option.cpf}>
                {option.label} - {option.cpf} {/* Exibir o CPF ao lado do nome */}
                </option>
              ))}
            </select>
          );
        } else {
          return <div>{params.value} - {params.row.cpf}</div>;
        }
      },
    },  
    {
      field: "cpf",
      headerName: "cpf",
      headerClassName: "super-app-theme--header",
      width: 170,
      editable: false,
    },
    // Coluna de cliente
    {
      field: "cliente",
      headerName: "Cliente",
      headerClassName: "super-app-theme--header",
      width: 300,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return (
            <select
              className="editar-venda"
              style={{
                width: "100%",
                height: "100%",
                //padding: "8px",
                borderRadius: "5px",
                backgroundColor: "var(--chart-secondary-color)",
                color: "var(--side-text-color3)",
                fontSize: "15px"
              }}
              value={params.value}
              onChange={(e) => {
                const newValue = e.target.value;
                const cpfCliente = e.target.selectedOptions[0].getAttribute("data-cpf"); // Obtenha o CPF do cliente selecionado
                const id = params.row.id;
                const updatedRows = rows.map((row) => {
                  if (row.id === id) {
                    return { ...row, cliente: newValue, cpfCliente: cpfCliente }; // Inclua o CPF na atualização
                  }
                  return row;
                });
                setRows(updatedRows);
              }}
            >
              {chartClientes.map((option) => (
                <option key={option.id} value={option.value} data-cpf={option.cpf}>
                  {option.label} - {option.cpf} {/* Exibir o CPF ao lado do nome */}
                </option>
              ))}
            </select>
          );
        } else {
          return <div>{params.value} - {params.row.cpfCliente}</div>;

        }
      },
    },
    {
      field: "cpfCliente",
      headerName: "CPF do Cliente",
      headerClassName: "super-app-theme--header",
      width: 170,
      editable: false,
      
    }, 
    {
      field: "segmento",
      headerName: "Segmento do Cliente",
      headerClassName: "super-app-theme--header",
      width: 170,
      editable: false,
      
    }, 
    {
      field: "produto",
      headerName: "Produto",
      headerClassName: "super-app-theme--header",
      width: 300,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return (
            <select
              className="editar-venda"
              style={{
                width: "100%",
                height: "100%",
                //padding: "8px",
                borderRadius: "5px",
                backgroundColor: "var(--chart-secondary-color)",
                color: "var(--side-text-color3)",
                fontSize: "15px"
              }}
              value={params.value}
              onChange={(e) => {
                const newValue = e.target.value;             
                const id = params.row.id;
                
                const selectedOption = e.target.selectedOptions[0];
                const valorProduto = selectedOption.getAttribute("data-valor"); 
                const idProduto =  selectedOption.getAttribute("data-idProduto");
                
                const updatedRows = rows.map((row) => {
                  if (row.id === id) {
                    return { ...row, produto: newValue, idProduto: idProduto, valor: valorProduto };
                  }
                  return row;
                });
                setRows(updatedRows);
              }}
            >
              {chartProdutos.map((option) => (
                <option key={option.id} value={option.value} data-idProduto={option.idProduto} data-valor={option.valor}>
                  {option.label} - {option.valor}
                </option>
              ))}
            </select>
          );
        } else {
          return <div>{params.value} - {params.row.idProduto}</div>;
        }
      },
    },
    {
      field: "idProduto",
      headerName: "ID_Produto",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      
    }, 
    {
      field: "data",
      headerName: "Data",
      headerClassName: "super-app-theme--header",
      width: 95,
      align: "left",
      headerAlign: "left",
      type: "date",
      editable: true,
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: "valor",
      headerName: "Valor da Venda",
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 130,
      align: "left",
      headerAlign: "left",
      editable: false,
      valueFormatter: (value: number) => {
        const formattedValue = numeral(value).format('0,0.00').replace('.', '_').replace(',', '.').replace(',', '.').replace('_', ',');
        return `R$ ${formattedValue}`;
      },
    },
    {
      field: "pagamento",
      headerName: "Forma de pagamento",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["À vista", "Parcelado"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      headerClassName: "super-app-theme--header",
      width: 70,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        //modo edição
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<RxCheck size={32} className="edit-button" />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<RxCross2 size={27} className="edit-button" />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        //botões de editar e deletar
        return [
          <GridActionsCellItem
            icon={<FaRegEdit size={22} className="edit-button" />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
          />,
        ];
      },
    },
  ];
  // Filtrar as colunas para remover as colunas de cpf
const filteredColumns = columns.filter((col) => col.field !== "cpf" && col.field !== "cpfCliente" && col.field !== "segmento" && col.field !== "idProduto");

  return (
    //tabela
    <Box className="sx-box">
      <h2 className="area-top-title">Vendas Recentes</h2>
      <DataGrid
        className="sx-data-grid"
        rows={rows}
        columns={filteredColumns}
        //botões de ação
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: (props) => (
            <EditToolbar
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setRowModesModel={function (_newModel: (oldModel: GridRowModesModel) => GridRowModesModel): void {
              throw new Error("Function not implemented.");
            } } {...props}
            setRows={setRows}
            rows={rows}            />
          ),
        }}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
        //a tabela divide - mostra 10 vendedores por página
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 12,
            },
          },
        }}
        pageSizeOptions={[20]}
      />
    </Box>
  );
};

export default Vendas;
