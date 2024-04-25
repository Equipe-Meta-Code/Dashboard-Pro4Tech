import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./Tabelas.scss";

const Vendas = () => {
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "venda", headerName: "Venda", width: 250, editable: true },
    {
      field: "vendedor",
      headerName: "Vendedor",
      width: 200,
    },
    {
      field: "data",
      headerName: "Data",
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
      field: "status",
      headerName: "Status",
      width: 110,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Incompleto", "Completo"],
    },
  ];

  const rows = [
    {
      id: 1,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Carlos Eduardo",
      data: "18/04/2024",
      valor: "320",
      status: "Completo",
    },
    {
      id: 2,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Matheus Teixeira",
      data: "11/04/2024",
      valor: "550",
      status: "Completo",
    },
    {
      id: 3,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Roberto Nunes",
      data: "02/04/2024",
      valor: "220",
      status: "Completo",
    },
    {
      id: 4,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Matheus Teixeira",
      data: "02/04/2024",
      valor: "980",
      status: "Completo",
    },
    {
      id: 5,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Fernanda Souza",
      data: "01/04/2024",
      valor: "1001",
      status: "Completo",
    },
    {
      id: 6,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Thiago Abreu",
      data: "21/03/2024",
      valor: "198",
      status: "Completo",
    },
    {
      id: 7,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Patrícia Soares",
      data: "20/03/2024",
      valor: "700",
      status: "Completo",
    },
    {
      id: 8,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Lucas Gonçalves",
      data: "19/03/2024",
      valor: "1700",
      status: "Completo",
    },
    {
      id: 9,
      venda: "Produto Novo para Cliente Novo",
      vendedor: "Rosana Tadeu",
      data: "10/03/2024",
      valor: "390",
      status: "Completo",
    },
  ];

  return (
    <Box className="sx-box">
      <h2 className="area-top-title">Vendas Recentes</h2>
      <DataGrid className="sx-data-grid"
        rows={rows}
        columns={columns}
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