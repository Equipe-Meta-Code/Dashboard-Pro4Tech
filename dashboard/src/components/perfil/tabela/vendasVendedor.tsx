import * as React from "react";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import "./VendasVendedor.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import ModalVendas from "../../pages/modal/modalVendas";
import calendario from "../../../assets/icons/calendario.svg";
import moment from "moment";
import numeral from "numeral";
//tabela no perfil do vendedor - últimas vendas dele

interface VendasVendedorProps {
  vendedorId: string;
}

// componente para a tabela de vendas
const VendasVendedor: React.FC<VendasVendedorProps> = ({ vendedorId }) => {
  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);
  const [chartVendedores, setChartVendedores] = useState([]);
  const [chartClientes, setChartClientes] = useState([]);


  // busca dados iniciais quando o componente é montado
  useEffect(() => {
    fetchData();
    fetchVendedores();
    fetchClientes();
  }, [vendedorId]);

  // atualiza as linhas da tabela quando chartData muda
  useEffect(() => {
    setRows(chartData);
    setInitialRows(chartData);
  }, [chartData]);

  // função para buscar dados gerais
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/geral");
      const data = response.data;
      
      // filtrar dados para pegar apenas as vendas do vendedor atual
      const filteredData = data.filter((item) => item.CPF_Vendedor === vendedorId);


      // pré-processamento para pegar apenas os dois primeiros nomes de cada vendedor
      const processedData = filteredData.map((item) => ({
        id: item.id,
        venda: item.tipoVendaGeral,
        vendedor: item.Vendedor.split(" ").slice(0, 2).join(" "),
        cpf: item.CPF_Vendedor,
        cliente: item.Cliente.split(" ").slice(0, 2).join(" "),
        cpfCliente: item.CNPJ_CPF_Cliente,
        segmento: item.Segmento_do_Cliente,
        data: item.Data_da_Venda,
        valor: item.Valor_de_Venda,
        pagamento: item.Forma_de_Pagamento,
      }));

      setChartData(processedData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // função para buscar os vendedores disponíveis
  const fetchVendedores = async () => {
    try {
      const response = await axios.get("http://localhost:8080/vendedores");
      const vendedores = response.data;

      const processedVendedores = vendedores.map((item) => ({
        value: item.Vendedor.split(" ").slice(0, 2).join(" "),
        cpf: item.CPF_Vendedor,
        label: `${item.Vendedor.split(" ").slice(0, 2).join(" ")}`,
      }));

      // atualizando o state com os vendedores disponíveis
      setChartVendedores(processedVendedores);
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
    }
  };

  // função para buscar os clientes disponíveis
  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/clientes");
      const clientes = response.data;

      const processedClientes = clientes.map((item) => ({
        value: item.Cliente.split(" ").slice(0, 2).join(" "),
        cpf: item.CNPJ_CPF_Cliente,
        segmento: item.Segmento_do_Cliente,
        label: `${item.Cliente.split(" ").slice(0, 2).join(" ")}`,
      }));

      // atualizando o state com os clientes disponíveis
      setChartClientes(processedClientes);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  // função para salvar mudanças no banco de dados
  const saveChangesToDatabase = async (updatedRows: GridRowModel[]) => {
    try {
      console.log("Chamando função saveChangesToDatabase");

      // busca todos os clientes e armazena os dados localmente
      const resClientes = await axios.get("http://localhost:8080/clientes");
      const clientes = resClientes.data;

      // mapeia os dados atualizados para o formato esperado pelo backend
      const updatedData = updatedRows.map((row) => {
        // busca o cliente correspondente pelo CPF
        const cliente = clientes.find(
          (c) => c.CNPJ_CPF_Cliente === row.cpfCliente
        );
        const segmentoDoCliente = cliente
          ? cliente.Segmento_do_Cliente
          : "Não encontrado";

        // cria o objeto rowData com os dados necessários
        return {
          id: row.id,
          Vendedor: row.vendedor,
          CPF_Vendedor: row.cpf,
          Cliente: row.cliente,
          CNPJ_CPF_Cliente: row.cpfCliente,
          Valor_de_Venda: row.valor,
          Forma_de_Pagamento: row.pagamento,
          Segmento_do_Cliente: segmentoDoCliente,
        };
      });

      // envia requisição PUT para o endpoint adequado no backend para realizar o update
      console.log("Updated Data OBJ: ", updatedData);
      await axios.put("http://localhost:8080/vendas_update", updatedData);
      console.log("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  // componente para a edição da tabela
  interface EditToolbarProps {
    setRows: (newRows: GridRowModel[]) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    rows: GridRowsProp;
  }

  // função para edição da tabela
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, rows } = props;

    // função adicionar nova linha
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

    // função para adicionar vendas ao banco de dados
    const handleAdicionar = async (
      Data_da_Venda,
      Vendedor,
      CPF_Vendedor,
      Produto,
      Cliente,
      CNPJ_CPF_Cliente,
      Valor_de_Venda,
      Forma_de_Pagamento
    ) => {
      try {
        const dataVenda = moment(Data_da_Venda, "DD/MM/YYYY");

        if (!dataVenda.isValid()) {
          throw new Error("Data_da_Venda inválida");
        }

        const dataFormatada = dataVenda.format("YYYY-MM-DD");

        const newData = {
          Data_da_Venda: dataFormatada,
          Vendedor: Vendedor,
          CPF_Vendedor: CPF_Vendedor,
          Produto: Produto,
          ID_Produto: "ID_Produto",
          Cliente: Cliente,
          CNPJ_CPF_Cliente: CNPJ_CPF_Cliente,
          Segmento_do_Cliente: "Segmento_do_Cliente",
          Valor_de_Venda: Valor_de_Venda,
          Forma_de_Pagamento: Forma_de_Pagamento,
        };

        console.log("Adicionando vendas", newData);

        console.log("DATA", Data_da_Venda);
        console.log("Vendedor", Vendedor);
        console.log("CPF DO Vendedor", CPF_Vendedor);
        console.log("Produto", Produto);
        console.log("ID_Produto", "id");
        console.log("Cliente", Cliente);
        console.log("CPF DO CLIENTE", CNPJ_CPF_Cliente);
        console.log("Segmento", "Segmento");
        console.log("Forma de pagamento", Forma_de_Pagamento);
        console.log("Valor", Valor_de_Venda);

        // envia requisição POST para o endpoint adequado no backend para adicionar os dados
        setOpenModal(false);
        await axios.post("http://localhost:8080/vendas_adicionar", newData);

        window.location.reload();
      } catch (error) {
        console.error("Erro ao adicionar vendedor:", error);
      }
    };

    const [openModal, setOpenModal] = useState(false);
    const [Data_da_Venda, setData_da_Venda] = useState("");
    const [Vendedor, setVendedor] = useState("");
    const [CPF_Vendedor, setCPF_Vendedor] = useState("");
    const [Produto, setProduto] = useState("");
    //const [ID_Produto, setID_Produto] = useState('');
    const [Cliente, setCliente] = useState("");
    const [CNPJ_CPF_Cliente, setCNPJ_CPF_Cliente] = useState("");
    //const [Segmento_do_Cliente, setSegmento_do_Cliente] = useState('');
    const [Valor_de_Venda, setValor_de_Venda] = useState("");
    const [Forma_de_Pagamento, setForma_de_Pagamento] = useState("");
    /*  const [selectedVendedor, setSelectedVendedor] = useState(''); */

    //botão de adicionar vendas e o modal
    return (
        <ModalVendas
          isOpen={openModal}
          setModalOpen={() => setOpenModal(!openModal)}
        >
          <div className="container-modalVendas">
            <div className="title-modalVendas">Adicionar Vendas</div>
            <div className="content-modalVendas">
              <div className="inputs-modalVendas">
                <div className="input-modalVendas">
                  <select
                    value={Vendedor}
                    onChange={(event) => {
                      setVendedor(event.target.value); // define o valor do vendedor
                      setCPF_Vendedor(
                        event.target.selectedOptions[0].getAttribute("data-cpf")
                      ); // define o CPF do vendedor
                    }}
                  >
                    <option value="">Selecione um vendedor</option>
                    {chartVendedores.map((vendedor) => (
                      <option
                        key={vendedor.value}
                        value={vendedor.value}
                        data-cpf={vendedor.cpf}
                      >
                        {vendedor.label} - {vendedor.cpf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-modalVendas">
                  <select
                    value={Cliente}
                    onChange={(event) => {
                      setCliente(event.target.value); // define o valor do cliente
                      setCNPJ_CPF_Cliente(
                        event.target.selectedOptions[0].getAttribute("data-cpf")
                      ); // define o CPF do cliente
                    }}
                  >
                    <option value="">Selecione um cliente</option>
                    {chartClientes.map((cliente) => (
                      <option
                        key={cliente.value}
                        value={cliente.value}
                        data-cpf={cliente.cpf}
                      >
                        {cliente.label} - {cliente.cpf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-modalVendas">
                  <img src={calendario} alt="" />
                  <InputMask
                    mask="99/99/9999"
                    value={Data_da_Venda}
                    onChange={(event) => setData_da_Venda(event.target.value)}
                    placeholder="DD/MM/AAAA"
                  />
                </div>

                <div className="input-modalVendas">
                  <input
                    type="text"
                    placeholder="Produto"
                    onChange={(event) => setProduto(event.target.value)}
                  />
                </div>

                <div className="input-modalVendas">
                  <input
                    type="text"
                    placeholder="Valor da Venda"
                    onChange={(event) => setValor_de_Venda(event.target.value)}
                  />
                </div>

                <div className="input-modalVendas">
                  <select
                    value={Forma_de_Pagamento}
                    onChange={(event) =>
                      setForma_de_Pagamento(event.target.value)
                    }
                  >
                    <option value="">Selecione a forma de pagamento</option>
                    <option value="Á vista">Á vista</option>
                    <option value="Parcelado">Parcelado</option>
                  </select>
                </div>
              </div>

              <div className="submit-container-modalVendas">
                <div
                  className="submit-modalVendas"
                  onClick={() =>
                    handleAdicionar(
                      Data_da_Venda,
                      Vendedor,
                      CPF_Vendedor,
                      Produto,
                      Cliente,
                      CNPJ_CPF_Cliente,
                      Valor_de_Venda,
                      Forma_de_Pagamento
                    )
                  }
                >
                  Adicionar
                </div>
              </div>
            </div>
          </div>
        </ModalVendas>
    );
  }

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  /* //função que interrompe a edição da linha quando o foco sai dela
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
    const { id, vendedor, cpf, cliente, cpfCliente, valor, pagamento, data } =
      newRow;
    const updatedRow = { ...newRow, isNew: false };
    // Chama a função para salvar as mudanças no banco de dados, passando o CPF selecionado
    await saveChangesToDatabase([
      { id, vendedor, cpf, cliente, cpfCliente, valor, pagamento, data },
    ]);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }; */

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "id",
      headerName: "ID_Venda",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "venda",
      headerName: "Venda",
      headerClassName: "super-app-theme--header",
      width: 240,
      editable: true,
    },
    {
      field: "cliente",
      headerName: "Cliente",
      headerClassName: "super-app-theme--header",
      width: 300,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return (
            <select
              className="editar-venda"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                backgroundColor: "var(--chart-secondary-color)",
                color: "var(--side-text-color3)",
              }}
              value={params.value}
              onChange={(e) => {
                const newValue = e.target.value;
                const cpfCliente =
                  e.target.selectedOptions[0].getAttribute("data-cpf"); // obter CPF do cliente selecionado
                const id = params.row.id;
                const updatedRows = rows.map((row) => {
                  if (row.id === id) {
                    return {
                      ...row,
                      cliente: newValue,
                      cpfCliente: cpfCliente,
                    }; // incluir CPF na atualização
                  }
                  return row;
                });
                setRows(updatedRows);
              }}
            >
              {chartClientes.map((option) => (
                <option
                  key={option.id}
                  value={option.value}
                  data-cpf={option.cpf}
                >
                  {option.label} - {option.cpf}{" "}
                  {/* Exibir o CPF ao lado do nome */}
                </option>
              ))}
            </select>
          );
        } else {
          return (
            <div>
              {params.value} - {params.row.cpfCliente}
            </div>
          );
          /*return (
            <div>
              {params.value} - {params.row.cpfCliente}
            </div>
          );
        */
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
      field: "data",
      headerName: "Data",
      headerClassName: "super-app-theme--header",
      width: 115,
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
      editable: true,
      valueFormatter: (value: number) => {
        const formattedValue = numeral(value)
          .format("0,0.00")
          .replace(".", "_")
          .replace(",", ".")
          .replace("_", ",");
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
      field: "comissao",
      headerName: "Comissão",
      headerClassName: "super-app-theme--header",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (value) => `%${value}`,
    },
  ];
  // filtrar as colunas para remover as colunas de cpf
  const filteredColumns = columns.filter(
    (col) =>
      col.field !== "cpf" &&
      col.field !== "cpfCliente" &&
      col.field !== "segmento"
  );

  return (
    //a tabela
    <Box className="sx-box">
      <h2 className="area-top-title">Últimas Vendas</h2>
      <DataGrid
        className="sx-data-grid"
        rows={rows}
        columns={filteredColumns}
        //botões de ação
        /* editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate} */
        slots={{
          toolbar: (props) => (
            <EditToolbar
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              setRowModesModel={function (
                _newModel: (oldModel: GridRowModesModel) => GridRowModesModel
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
        //a tabela divide - mostra 9 vendas por página
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 9,
            },
          },
        }}
        pageSizeOptions={[9]}
      />
    </Box>
  );
};

export default VendasVendedor;
