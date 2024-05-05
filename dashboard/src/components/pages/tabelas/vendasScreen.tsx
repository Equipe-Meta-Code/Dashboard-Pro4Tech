import * as React from "react";
import { useEffect, useState } from 'react';

import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FaRegEdit } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { MdAdd } from "react-icons/md";
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

const Vendas = () => {
  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);
  const [chartVendedores, setChartVendedores] = useState([]);
  
  useEffect(() => {
    fetchData();
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
        venda: item.tipoVenda,
        vendedor: item.Vendedor.split(' ').slice(0, 2).join(' '),
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
        label: item.Vendedor.split(' ').slice(0, 2).join(' '), // Você pode ajustar o label conforme necessário
      }));
      // Atualizando o state com os vendedores disponíveis
      setChartVendedores(processedVendedores);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
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

    //botão para adicionar nova venda
    return (
      <GridToolbarContainer>
        <Button
          className="text-button"
          startIcon={<MdAdd size={20} className="edit-button" />}
          onClick={handleClick}
        >
          Adicionar
        </Button>
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
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id",
      headerName: "ID_Venda",
      headerClassName: "super-app-theme--header",
      width: 120,
    },
    {
      field: "venda",
      headerName: "Venda",
      headerClassName: "super-app-theme--header",
      width: 350,
      editable: true,
    },
    {
      field: "vendedor",
      headerName: "Vendedor",
      headerClassName: "super-app-theme--header",
      width: 230,
      editable: true,
    },
    {
      field: "data",
      headerName: "Data",
      headerClassName: "super-app-theme--header",
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
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (value) => `R$${value}`,
    },
    {
      field: "pagamento",
      headerName: "Forma de pagamento",
      headerClassName: "super-app-theme--header",
      width: 190,
      editable: true,
      type: "singleSelect",
      valueOptions: ["À vista", "Parcelado"],
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
        ];
      },
    },
  ];

  return (
    //tabela
    <Box className="sx-box">
      <h2 className="area-top-title">Vendas Recentes</h2>
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
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
      />
    </Box>
  );
};

export default Vendas;
