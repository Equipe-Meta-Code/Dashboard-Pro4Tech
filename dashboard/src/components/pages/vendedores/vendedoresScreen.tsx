import * as React from "react";
import "./Vendedores.scss";
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

const Vendedores = () => {
  const initialRows: GridRowsProp = [
    {
      id: 1,
      vendedor: "Matheus Teixeira",
      cpf: "12312312312",
      valor: 140,
      tipoVenda: "Produto Novo",
      ultimaVenda: "01/02/2024",
    },
    {
      id: 2,
      vendedor: "Roberto Nunes",
      cpf: "11112312312",
      valor: 310,
      tipoVenda: "Cliente Novo",
      ultimaVenda: "10/04/2024",
    },
    {
      id: 3,
      vendedor: "Carlos Eduardo",
      cpf: "22212312312",
      valor: 310,
      tipoVenda: "Produto Antigo",
      ultimaVenda: "10/13/2024",
    },
    {
      id: 4,
      vendedor: "Fernanda Souza",
      cpf: "33312312312",
      valor: 110,
      tipoVenda: "Produto Novo",
      ultimaVenda: "10/01/2024",
    },
    {
      id: 5,
      vendedor: "Thiago Abreu",
      cpf: "44412312312",
      valor: 1000,
      tipoVenda: "Produto Novo",
      ultimaVenda: "10/02/2024",
    },
    {
      id: 6,
      vendedor: "Patrícia Soares",
      cpf: "55512312312",
      valor: 150,
      tipoVenda: "Produto Antigo",
      ultimaVenda: "10/04/2024",
    },
    {
      id: 7,
      vendedor: "Lucas Gonçalves",
      cpf: "66612312312",
      valor: 440,
      tipoVenda: "Cliente Novo",
      ultimaVenda: "14/02/2024",
    },
    {
      id: 8,
      vendedor: "Rosana Tadeu",
      cpf: "77712312312",
      valor: 360,
      tipoVenda: "Cliente Novo",
      ultimaVenda: "11/01/2024",
    },
    {
      id: 9,
      vendedor: "Laís Santos",
      cpf: "88812312312",
      valor: 650,
      tipoVenda: "Produto Antigo",
      ultimaVenda: "15/04/2024",
    },
    {
      id: 10,
      vendedor: "Roberto Carlos",
      cpf: "99912312312",
      valor: 880,
      tipoVenda: "Produto Novo",
      ultimaVenda: "15/04/2024",
    },
    {
      id: 11,
      vendedor: "Thaís Araujo",
      cpf: "00012312322",
      valor: 600,
      tipoVenda: "Produto Antigo",
      ultimaVenda: "15/04/2024",
    },
  ];

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
    return (
      <GridToolbarContainer>
        <Button className="add-vendedor"
          startIcon={<MdAdd size={20} />}
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
    { field: "id", headerName: "ID", width: 50, editable: true },
    {
      field: "vendedor",
      headerName: "Vendedor",
      width: 170,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "cpf",
      headerName: "CPF",
      width: 130,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "ultimaVenda",
      headerName: "Última Venda",
      width: 140,
      align: "left",
      headerAlign: "left",
      type: "date",
      editable: true,
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: "valor",
      headerName: "Valor da Venda",
      type: "number",
      width: 130,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (value) => `R$${value}`,
    },
    {
      field: "tipoVenda",
      headerName: "Tipo de Venda",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Produto Novo", "Cliente Novo", "Produto Antigo"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
              /*sx={{
                color: "primary.main",
              }}*/
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<MdOutlineCancel size={20} className="edit-button" />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              //color="inherit"
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
            //color="inherit"
          />,
          <GridActionsCellItem
            icon={<MdDeleteOutline size={20} className="edit-button" />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            //color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    //tabela
    <Box className="sx-box">
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
        //a tabela divide - mostra 10 vendedores por página
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Vendedores;
