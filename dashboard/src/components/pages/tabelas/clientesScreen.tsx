import * as React from "react";
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import "./Tabelas.scss";
import Box from "@mui/material/Box";
import numeral from 'numeral';
import Button from "@mui/material/Button";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { MdDeleteOutline, MdAdd, MdOutlineCleaningServices } from "react-icons/md";
import { TfiEraser } from "react-icons/tfi";
import { IoSearchSharp } from "react-icons/io5";
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

import Modal from "../modal/modal";
import user_icon from '../../../assets/person.png'

const Clientes = () => {
  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);

  const [openModalEditar, setOpenModalEditar] = useState(false)

  const [clienteEditando, setClienteEditando] = useState({
    CNPJ_CPF_Cliente: '',
    Cliente: '',
    Segmento_do_Cliente: ''
  });

  async function buscarCliente(id) {
    try {
      const clientes = await axios.get('http://localhost:8080/clientes');
      const dataClientes = clientes.data;
  
      const cliente = dataClientes.find(cliente => cliente.id === id);
  
      if (cliente) {
        setClienteEditando({
          CNPJ_CPF_Cliente: cliente.CNPJ_CPF_Cliente,
          Cliente: cliente.Cliente,
          Segmento_do_Cliente: cliente.Segmento_do_Cliente
        });
        setOpenModalEditar(true);
      } else {
        throw new Error(`Produto com id ${id} não encontrado`);
      }
    } catch (error) {
      console.error('Erro ao buscar o produto:', error);
    }
  }
  
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    setInitialRows(chartData);
  }, [chartData]);
  
  useEffect(() => {
    setRows(chartData);
  }, [chartData]);

  const fetchData = async () => {
    try {

      const responseClientes = await axios.get('http://localhost:8080/clientes');
      const dataClientes = responseClientes.data;

      const responseGeral = await axios.get('http://localhost:8080/geral');
      const dataGeral = responseGeral.data;

      
      const processedData = dataClientes.map(itemCliente => {
        // Filtrar as compras em /geral para o cliente atual
        const comprasCliente = dataGeral.filter(itemGeral => itemGeral.CNPJ_CPF_Cliente === itemCliente.CNPJ_CPF_Cliente);
        // Se houver compras para o cliente atual
        if (comprasCliente.length > 0) {
          
          const ultimaCompra = comprasCliente.reduce((prev, current) => (prev.Data_da_Venda > current.Data_da_Venda) ? prev : current);
   
          return {
            id: itemCliente.id,
            cliente: itemCliente.Cliente,
            cpf: itemCliente.CNPJ_CPF_Cliente,
            segmento: itemCliente.Segmento_do_Cliente,
            // Valor_de_Venda da última compra de /geral
            valor: ultimaCompra.Valor_de_Venda,
            ultimaCompra: ultimaCompra.Data_da_Venda,
            tipoVenda: ultimaCompra.tipoVendaProduto

          };

        } else {
          // Se não houver compras para o cliente atual, define vazio par os campos
          return {
            id: itemCliente.id,
            cliente: itemCliente.Cliente.split(' ').slice(0, 2).join(' '),
            cpf: itemCliente.CNPJ_CPF_Cliente,
            segmento: itemCliente.Segmento_do_Cliente,
            valor: '', 
            ultimaCompra: '',
            tipoVenda: ''
          };
        }
      });
      
      setChartData(processedData);
      console.log(processedData);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };
  
  const saveChangesToDatabase = async (clienteEditando) => {
    try {
        console.log("Chamando função saveChangesToDatabase");
        const updatedData = [clienteEditando];
        console.log("Updated Data OBJ: ", updatedData);
        await axios.put('http://localhost:8080/vendas_clientes_update', updatedData);
        console.log("Dados atualizados com sucesso!");
        setOpenModalEditar(!openModalEditar)
        fetchData()
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
    }
};

  interface EditToolbarProps {
    setRows: (newRows: GridRowModel[]) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
    rows: GridRowsProp;
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, rows } = props;
    const [filter, setFilter] = useState("");

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

    const handleAdicionar = async (Cliente, CNPJ_CPF_Cliente,Segmento_do_Cliente) => {
      try {
        const newData = {
          Cliente: Cliente,
          CNPJ_CPF_Cliente: CNPJ_CPF_Cliente,
          Segmento_do_Cliente: Segmento_do_Cliente,
        };
        
        console.log("Adicionando vendedor", newData);
    
        // Envia uma requisição POST para o endpoint adequado no backend para adicionar os dados
        await axios.post('http://localhost:8080/clientes_adicionar', newData);


        window.location.reload();
      } catch (error) {
        console.error("Erro ao adicionar vendedor:", error);
      }
      
    };

    const [openModal, setOpenModal] = useState(false)
    const [Cliente, setVendedor] = useState('');
    const [CNPJ_CPF_Cliente, setCPF_Vendedor] = useState('');
    const [Segmento_do_Cliente, setSegmento_do_Cliente] = useState('');
    const [mask, setMask] = useState('');


    const applyFilter = () => {
      const inputValue = filter;
      console.log(filter)
      const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
      const hasReachedCNPJLength = numericValue.length === 14;

      if (hasReachedCNPJLength) {
        // Se o usuário digitou 11 dígitos, aplica a máscara de CPF
        const filteredRows = chartData.filter((row) =>
          row.cpf.startsWith(filter)
        );
        setRows(filteredRows);
      } else {
        // Se ainda não digitou 11 dígitos, não aplica a máscara
        const filteredRows = chartData.filter((row) =>
          row.cliente.toLowerCase().startsWith(filter.toLowerCase())
        );
        
        setRows(filteredRows);
      }
    };

    const limparFiltro = async () => {
      setRows(chartData)
      setFilter('')
      setMask('')
     }


    

    //botão de adicionar vendedor
    return (
      <GridToolbarContainer>
        <div 
          className="toolbar-content" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%' 
          }}
        >
          <div className="inputs-modal" style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'flex-start'}}>
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
                    console.log('É um número e tem 11 dígitos');
                  } else if(!isNumeric) {
                    // Se não for um número ou não digitou 11 dígitos, não aplica a máscara
                    setMask('');
                  }
                  
                  setFilter(inputValue); // Atualiza o filtro conforme o usuário digita
                }}
              />
            </div>
            <button onClick={applyFilter}><IoSearchSharp size={22} className="filtro-button"/></button>
            <button onClick={limparFiltro}><TfiEraser size={22} className="filtro-button" /></button>
          </div>

          <Button className="text-button"
            startIcon={<MdAdd size={20} className="edit-button"/>}
            onClick={() => setOpenModal(true)}>Adicionar</Button>
        </div>

        <Modal isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)}> 
          <div className="container-modal">
            <div className="title-modal">Adicionar Cliente</div>
            <div className="content-modal"> 
              <div className="inputs-modal">
                <div className="input-modal">
                  <img src={user_icon} alt="" />
                  <input type="text" placeholder="Nome do Cliente" onChange={event => setVendedor(event.target.value)}/>
                </div>

                <div className="input-modal"> 
                  <img src={user_icon} alt="" />
                  <InputMask
                    mask="999.999.999-99"
                    value={CNPJ_CPF_Cliente}
                    onChange={event => setCPF_Vendedor(event.target.value)}
                    placeholder="CNPJ/CPF do Cliente"
                  />
                </div>

                <div className="input-modal">
                  <img src={user_icon} alt="" />
                  <input type="text" placeholder="Segmento do Cliente" onChange={event => setSegmento_do_Cliente(event.target.value)}/>
                </div>
              </div>

              <div className="submit-container-modal">
                <div className="submit-modal" onClick={() => handleAdicionar(Cliente, CNPJ_CPF_Cliente, Segmento_do_Cliente)}>Adicionar</div>
              </div>
            </div>
          </div>      
        </Modal>
      </GridToolbarContainer>

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
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  
    // Chama a função para salvar as mudanças no banco de dados
    /* await savarEdicaoNoBanco([updatedRow]); */
    
    return updatedRow;
  };

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "cpf",
      headerName: "CPF/CNPJ",
      headerClassName: "super-app-theme--header",
      width: 300,
      editable: false,
    },
    {
      field: "cliente",
      headerName: "Nome",
      headerClassName: "super-app-theme--header",
      width: 350,
      editable: true,
    },
    {
      field: "segmento",
      headerName: "Segmento do Cliente",
      headerClassName: "super-app-theme--header",
      width: 170,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "ultimaCompra",
      headerName: "Última Compra",
      headerClassName: "super-app-theme--header",
      width: 170,
      align: "left",
      headerAlign: "left",
      type: "date",
      editable: false,
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: "valor",
      headerName: "Valor",
      headerClassName: "super-app-theme--header",
      width: 110,
      editable: false,
      valueFormatter: (value: number) => {
        const formattedValue = numeral(value).format('0,0.00').replace('.', '_').replace(',', '.').replace('_', ',');
        return `R$ ${formattedValue}`;
      },
    },
    {
      field: "tipoVenda",
      headerName: "Tipo de Venda",
      headerClassName: "super-app-theme--header",
      width: 120,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      headerClassName: "super-app-theme--header",
      width: 100,
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
            onClick={()=> buscarCliente(id)}
          />,
        ];
      },
    },
  ];

  return (
    <>
      {/* tabela */}
      <Box className="sx-box">
        <h2 className="area-top-title">Clientes</h2>
        <DataGrid
          className="sx-data-grid"
          rows={rows}
          columns={columns}
          //botões de ação
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}

          slots={{
            toolbar: (props) => (
              <EditToolbar
              setRowModesModel={function (newModel: (oldModel: GridRowModesModel) => GridRowModesModel): void {
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
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20]}
        />
      </Box>
      <Modal 
        isOpen={openModalEditar} 
        setModalOpen={() => {
          setOpenModalEditar(!openModalEditar);
        }}
      >
        <div className="container-modal">
          <div className="title-modal">Editar Cliente</div>
          <div className="content-modal">
            <div className="inputs-modal">
              <div className="input-modal">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={clienteEditando.Cliente}
                  onChange={(event) => setClienteEditando({
                    ...clienteEditando,
                    Cliente: event.target.value
                  })}
                />
              </div>
              <div className="input-modal">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="Valor do Produto"
                  value={clienteEditando.Segmento_do_Cliente}
                  onChange={(event) => setClienteEditando({
                    ...clienteEditando,
                    Segmento_do_Cliente: event.target.value
                  })}
                />
              </div>
            </div>

            <div className="submit-container-modal">
              <div
                className="submit-modal"
                onClick={() => saveChangesToDatabase(clienteEditando)}
              >
                Editar
              </div>
            </div>
          </div>
        </div>
        </Modal>

    </>
  );
};

export default Clientes;
