import * as React from "react";
import { useEffect, useState } from 'react';
import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  MdDeleteOutline,
  MdEdit,
  MdSave,
  MdAdd,
  MdOutlineCancel,
} from "react-icons/md";
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

const Vendedores = () => {
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
      const response = await axios.get('http://localhost:8080/vendedores');
      const data = response.data;
      // Pré-processamento para pegar apenas os dois primeiros nomes de cada vendedor
      
      const processedData = data.map(item => ({
        id: item.id,
        vendedor: item.Vendedor.split(' ').slice(0, 2).join(' '),
        cpf: item.CPF_Vendedor,
        valor: item.Valor_da_Venda,
        ultimaVenda: item.Ultima_Venda,
        tipoVenda: item.Tipo_de_Venda
      }));
      setChartData(processedData)
      console.log(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
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

    //botão de adicionar vendedor
    return (
      <GridToolbarContainer>
        <Button 
          className="text-button"
          startIcon={<MdAdd size={20} className="edit-button"/>}
          onClick={handleClick}
        >
          Adicionar
        </Button>
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
  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
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
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "vendedor",
      headerName: "Vendedor",
      headerClassName: 'super-app-theme--header',
      width: 230,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "cpf",
      headerName: "CPF",
      headerClassName: 'super-app-theme--header',
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "ultimaVenda",
      headerName: "Última Venda",
      headerClassName: 'super-app-theme--header',
      width: 170,
      align: "left",
      headerAlign: "left",
      type: "date",
      editable: true,
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: "valor",
      headerName: "Valor da Venda",
      headerClassName: 'super-app-theme--header',
      type: "number",
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (value) => `R$${value}`,
    },
    {
      field: "tipoVenda",
      headerName: "Tipo de Venda",
      headerClassName: 'super-app-theme--header',
      width: 350,
      align: "left",
      headerAlign: "left",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Produto Novo", "Cliente Novo", "Produto Antigo"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      headerClassName: 'super-app-theme--header',
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        //modo edição
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<MdSave size={20} className="edit-button" />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<MdOutlineCancel size={20} className="edit-button" />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        //botões de editar e deletar
        return [
          <GridActionsCellItem
            icon={<MdEdit size={20} className="edit-button" />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<MdDeleteOutline size={20} className="edit-button" />}
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
      <h2 className="area-top-title">Vendedores</h2>
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

export default Vendedores;
