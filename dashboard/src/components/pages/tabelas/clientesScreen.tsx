import * as React from "react";
import { useEffect, useState } from 'react';

import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FaRegEdit } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
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

const Clientes = () => {
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

      const response = await axios.get('http://localhost:8080/geral');
      const data = response.data;
      
      const processedClients = {};// Objeto para rastrear clientes já processados
      const processedData = data.reduce((acc, item) => {// Filtrar apenas os dois primeiros nomes de cada cliente
        const cpf = item.CNPJ_CPF_Cliente;
        
        if (!processedClients[cpf]) {// Verificar se o CPF já foi processado
          
          processedClients[cpf] = true;// Adicionar o CPF ao objeto de clientes processados

          acc.push({// Adicionar os dados do cliente ao conjunto de dados processado
            id: item.id,
            cadastro: cpf,
            nome: item.Cliente.split(' ').slice(0, 2).join(' '),
            ultimaCompra: item.Data_da_Venda
          });
        }
  
        return acc;
      }, []);
  
      setChartData(processedData);
      console.log(processedData);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

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
    {
      field: "cadastro",
      headerName: "CPF/CNPJ",
      headerClassName: "super-app-theme--header",
      width: 300,
      editable: true,
    },
    {
      field: "nome",
      headerName: "Nome",
      headerClassName: "super-app-theme--header",
      width: 350,
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
      editable: true,
      valueGetter: (value) => value && new Date(value),
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

export default Clientes;