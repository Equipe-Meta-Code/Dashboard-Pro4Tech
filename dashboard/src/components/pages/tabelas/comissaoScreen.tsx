import * as React from "react";
import { useEffect, useState } from 'react';
import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { FaRegEdit } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { MdDeleteOutline, MdAdd } from "react-icons/md";
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
import axios from "axios";
 
const Comissao = () => {
  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);
  const [cardData, setCardData] = useState({ venda1: 10.0, venda2: 15.0, venda3: 20.0, venda4: 25.0 });

 
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
 
      // Pré-processamento para pegar apenas os dois primeiros nomes de cada vendedor
      const processedData = data.map(item => ({
        id: item.id,
        vendedor: item.Vendedor.split(' ').slice(0, 2).join(' '),
        cpf: item.CPF_Vendedor,
        produto: item.Produto,
        id_produto: item.ID_Produto,
        valor_da_venda: item.Valor_de_Venda,
        tipoVenda: item.tipoVendaGeral,
        porcentagem: item.Porcentagem
      }));
      setChartData(processedData)
      console.log(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };
  const saveChangesToDatabase = async (updatedRows: GridRowModel[]) => {
   
  }
 
  const updatePercentages = (key, value) => {
    let tipoVenda;
    switch (key) {
      case "venda1":
        tipoVenda = "Produto Antigo - Cliente Antigo";
        break;
      case "venda2":
        tipoVenda = "Produto Novo - Cliente Novo";
        break;
      case "venda3":
        tipoVenda = "Produto Novo - Cliente Antigo";
        break;
      case "venda4":
        tipoVenda = "Produto Antigo - Cliente Novo";
        break;
      default:
        return;
    }
 
    setRows(prevRows =>
      prevRows.map(row =>
        row.tipoVenda === tipoVenda ? { ...row, porcentagem: value } : row
      )
    );
  };
 
 
  //adicionar na tabela
  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
 
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
 
    const handleClick = () => {
      //quando o botão é acionado
      const id = "id";
      setRows((oldRows) => [
        ...oldRows,
        { id, vendedores: "", cpf: "", isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "vendedores" },
      }));
    };
 
    //botão de adicionar vendedor
   /*  return (
      <GridToolbarContainer>
        <Button className="add-vendedor"
          startIcon={<MdAdd size={20} className="edit-button"/>}
          onClick={handleClick}
        >
          Adicionar
        </Button>
      </GridToolbarContainer>
    ); */
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
  const processRowUpdate = async (newRow: GridRowModel) => {
    const { vendedor, cpf, produto,id_produto, valor_da_venda, tipoVenda, porcentagem} = newRow;
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
    await saveChangesToDatabase([{vendedor, cpf, produto,id_produto, valor_da_venda, tipoVenda, porcentagem }]);
  };
 
  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleCardChange = (key: string, value: string) => {
  // Converta o valor de string para número float
  const parsedValue = parseFloat(value);
  if (!isNaN(parsedValue)) {
    // Se o valor for válido, atualize o estado
    setCardData(prev => ({ ...prev, [key]: parsedValue }));
    updatePercentages(key, parsedValue);
  }
};

 
 
  const columns: GridColDef[] = [
    {
      field: "vendedor",
      headerName: "Vendedor",
      headerClassName: "super-app-theme--header",
      width: 170,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "cpf",
      headerName: "CPF",
      headerClassName: "super-app-theme--header",
      width: 130,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
        field: "produto",
        headerName: "Produto",
        headerClassName: "super-app-theme--header",
        width: 170,
        align: "left",
        headerAlign: "left",
        editable: true,
      },
      {
        field: "id_produto",
        headerName: "ID_Produto",
        headerClassName: "super-app-theme--header",
        width: 170,
        align: "left",
        headerAlign: "left",
        editable: true,
      },
      {
        field: "valor_da_venda",
        headerName: "Valor da Venda",
        headerClassName: "super-app-theme--header",
        width: 190,
        align: "left",
        headerAlign: "left",
        editable: true,
        valueGetter: (value)=> `R$${value}`,
      },
    {
      field: "tipoVenda",
      headerName: "Tipo de Venda",
      headerClassName: "super-app-theme--header",
      width: 240,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
        field: "porcentagem",
        headerName: "Porcentagem",
        headerClassName: "super-app-theme--header",
        width: 150,
        align: "left",
        headerAlign: "left",
        editable: true,
        valueGetter: (value) => `%${value}`
      },
    
  ];
 
  return (
    <Box className="sx-box">
      <h2 className="area-top-title">Comissões</h2>
      <DataGrid
        className="sx-data-grid"
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
      />
     <Box className="cards-container" sx={{ flexGrow: 1, marginTop: 2 }}>
        <Grid container spacing={2}>
          {[
            { key: "venda1", label: "Produto Antigo e Cliente Antigo" },
            { key: "venda2", label: "Produto Novo e Cliente Novo" },
            { key: "venda3", label: "Produto Novo e Cliente Antigo" },
            { key: "venda4", label: "Produto Antigo e Cliente Novo" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ minWidth: 275, backgroundColor: 'var(--chart-secondary-color)' }} className="cardComissao">
                <CardContent>
                <Typography variant="h5" component="div" style={{ color: 'var(--light-color)' }}>
                    {item.label}
                  </Typography>
                  <TextField
                    variant="outlined"
                    label="Porcentagem"
                    value={cardData[item.key]}
                    onChange={(e) => handleCardChange(item.key, e.target.value)}
                    InputProps={{
                      endAdornment: <Typography>%</Typography>
                    }}
                    sx={{ marginTop: 2 }}
                    type="number" // Defina o tipo de entrada como "number"
                    inputProps={{ step: "0.1" }} // Defina o passo para permitir números decimais
                    />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
 
export default Comissao;
