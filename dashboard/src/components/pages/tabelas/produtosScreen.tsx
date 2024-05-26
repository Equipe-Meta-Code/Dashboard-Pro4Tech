import * as React from "react";
import { useEffect, useState } from "react";
import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { MdDeleteOutline, MdAdd, MdOutlineCleaningServices } from "react-icons/md";
import numeral from 'numeral';
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
  GridSlots,
} from "@mui/x-data-grid";
import App from "../../../App";
import axios from "axios";

import Modal from "../modal/modal";
import user_icon from "../../../assets/person.png";

const Produtos = () => {
  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);

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
      const responseProduto = await axios.get(
        "http://localhost:8080/produtos"
      );
      const dataProduto = responseProduto.data;

      // Mapear os dados de /produtos
      const processedData = dataProduto.map((itemProduto) => {
        return {
          id: itemProduto.id,
          produto: itemProduto.Produto,
          valor: itemProduto.Valor_de_Venda,
        };
      });

      setChartData(processedData);
      console.log(processedData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  //editar no banco
  const saveChangesToDatabase = async (updatedRows: GridRowModel[]) => {
    try {
      console.log("Chamando função saveChangesToDatabase");

      // Mapeia os dados atualizados para o formato esperado pelo backend
      const updatedData = updatedRows.map((row) => ({
        id: row.id,
        Produto: row.produto,
        Valor_de_Venda: row.valor,
      }));
      // Envia uma requisição PUT para o endpoint adequado no backend para realizar o update
      console.log("Updated Data OBJ: ");
      console.log(updatedData);
      await axios.put("http://localhost:8080/produtos_update", updatedData);

      // Agora, para cada produto atualizado, também atualizamos as vendas associadas a ele
      /* updatedRows.forEach(async (row) => {
        const response = await axios.get(
          `http://localhost:8080/vendas?ID_Produto=${row.id}`
        );
        const vendas = response.data;
        // Atualize as vendas associadas a esse produto
        const updatedVendas = vendas.map((venda) => ({
          ...venda,
          id: row.id,
          Produto: row.produto, // Atualize o nome do produto, se necessário
          Valor_de_Venda: row.valor,
          // Atualize outras propriedades da venda, se necessário
        }));
        await axios.put(
          "http://localhost:8080/vendas_update_produto",
          updatedVendas
        );
      }); */

      console.log("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  //adicionar na tabela
  interface EditToolbarProps {
    setRows: (newRows: GridRowModel[]) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    rows: GridRowsProp;
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, rows } = props;
    const [filter, setFilter] = useState("");

    const handleClick = () => {
      //calcula o próximo ID baseado no maior ID existente na tabela
      const nextId = Math.max(...rows.map((row) => row.id), 0) + 1;

      const newRows = [
        { id: nextId, produto: "", valor: "", isNew: true },
        ...rows, //adiciona a nova linha no início do array
      ];

      setRows(newRows);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [nextId]: { mode: GridRowModes.Edit, fieldToFocus: "produto" },
      }));
    };

    const handleAdicionar = async (Produto, Valor_de_Venda) => {
      try {
        const newData = {
          Produto: Produto,
          Valor_de_Venda: Valor_de_Venda,
        };

        console.log("Adicionando produto", newData);

        // Envia uma requisição POST para o endpoint adequado no backend para adicionar os dados
        await axios.post("http://localhost:8080/produto_adicionar", newData);

        setOpenModal(false);
        console.log("Produto adicionado com sucesso!");
        window.location.reload();
      } catch (error) {
        console.error("Erro ao adicionar produto:", error);
      }
    };

    const handleFiltrar = async (Filtro) => {}
    const applyFilter = () => {
      const filteredRows = chartData.filter(row =>
        row.produto.toLowerCase().startsWith(filter.toLowerCase())
      );
      setRows(filteredRows);
    };

    const limparFiltro = async () => {
      setRows(chartData)
     }

    const [openModal, setOpenModal] = useState(false);
    const [Produto, setProduto] = useState("");
    const [Valor_de_Venda, setValor_de_Venda] = useState("");

    //botão de adicionar
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
              <input
                type="text"
                placeholder="Nome do Produto"
                value={filter}
                onChange={event => setFilter(event.target.value)} // Atualiza o filtro conforme o usuário digita
              />
            </div>
            <button onClick={applyFilter}><FaSearch size={22} className="filtro-button"/></button>
            <button onClick={limparFiltro}><MdOutlineCleaningServices size={22} className="filtro-button" /></button>
          </div>

        <Button
          className="text-button"
          startIcon={<MdAdd size={20} className="edit-button" />}
          onClick={() => setOpenModal(true)}
        >
          Adicionar
        </Button>
      </div>
        <Modal isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)}>
          <div className="container-modal">
            <div className="title-modal">Adicionar Produto</div>
            <div className="content-modal">
              <div className="inputs-modal">
                <div className="input-modal">
                  <img src={user_icon} alt="" />
                  <input
                    type="text"
                    placeholder="Nome do Produto"
                    onChange={(event) => setProduto(event.target.value)}
                  />
                </div>
                <div className="input-modal">
                  <img src={user_icon} alt="" />
                  <input
                    type="text"
                    placeholder="Valor do Produto"
                    onChange={(event) => setValor_de_Venda(event.target.value)}
                  />
                </div>
              </div>

              <div className="submit-container-modal">
                <div
                  className="submit-modal"
                  onClick={() => handleAdicionar(Produto, Valor_de_Venda)}
                >
                  Adicionar
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </GridToolbarContainer>
    );
  }

  const [rows, setRows] = React.useState(chartData);
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

  //remover linha quando o botão deletar for clicado
  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      // Faz uma requisição DELETE para o backend para deletar o produto com o ID especificado
      await axios.delete(`http://localhost:8080/produto/${id}`);

      // Atualiza o estado das linhas, removendo a linha deletada
      setRows(rows.filter((row) => row.id !== id));
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
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
    const {id, produto, valor} = newRow;
    await saveChangesToDatabase([{id, produto, valor}])
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID_Produto",
      headerClassName: "super-app-theme--header",
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "produto",
      headerName: "Produto",
      headerClassName: "super-app-theme--header",
      width: 430,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "valor",
      headerName: "Valor",
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (value) => `R$${value}`,
      valueFormatter: (value: number) => {
        const formattedValue = numeral(value).format('0,0.00').replace('.', '_').replace(',', '.').replace('_', ',');
        return `R$ ${formattedValue}`;
      },
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
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<MdDeleteOutline size={25} className="edit-button" />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    //tabela
    <Box className="sx-box">
      <h2 className="area-top-title">Produtos</h2>
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
              setRowModesModel={function (
                newModel: (oldModel: GridRowModesModel) => GridRowModesModel
              ): void {
                throw new Error("Function not implemented.");
              }}
              {...props}
              setRows={setRows}
              rows={rows}
            />
          ),
        }}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
        //a tabela divide - mostra 20 vendedores por página
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
  );
};

export default Produtos;
