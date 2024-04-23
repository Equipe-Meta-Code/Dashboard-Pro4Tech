import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";


const Vendedores = () => {
  const columns: GridColDef<(typeof rows)[number]>[] = [
    
    { field: "id", headerName: "ID", width: 40 },
    {
      field: "vendedor",
      headerName: "Vendedor",
      width: 170,
      editable: true,
    },
    {
      field: "cpf",
      headerName: "CPF",
      width: 130,
    },
    {
      field: "ultimaVenda",
      headerName: "Última Venda",
      width: 140,
      type: "date",
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: "valor",
      headerName: "Valor da Venda",
      type: "number",
      width: 120,
      valueGetter: (value) => `R$${value}`,
    },
    {
      field: "tipoVenda",
      headerName: "Tipo de Venda",
      width: 160,
    },
  ];

  const rows = [
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
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Vendedores;
