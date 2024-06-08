import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import "./Tabelas.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TfiEraser } from "react-icons/tfi";
import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineUserDelete } from "react-icons/ai";
import perfilsemfoto from "../../perfil/perfilsemfoto.jpg";
import api from "../../../services/api";
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
import numeral from "numeral";

const Vendedores = () => {
  const [chartData, setChartData] = useState([]);
  const [initialRows, setInitialRows] = useState<GridRowsProp>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInitialRows(chartData);
  }, [chartData]);

  useEffect(() => {
    setRows(chartData);
  }, [chartData]);

  const selecionadoFunc = async (id: GridRowId) => {
    console.log(id)
    const selecionado = id
    return selecionado
  }
  const fetchData = async () => {
    try {
      const responseVendedores = await axios.get(
        "http://localhost:8080/vendedores"
      );
      const dataVendedores = responseVendedores.data;

      const responseGeral = await axios.get("http://localhost:8080/geral");
      const dataGeral = responseGeral.data;

      // Mapear os dados de /vendedores
      const processedData = dataVendedores.map((itemVendedor) => {
        // Filtrar as vendas em /geral para o vendedor atual
        const vendasVendedor = dataGeral.filter(
          (itemGeral) => itemGeral.CPF_Vendedor === itemVendedor.CPF_Vendedor
        );
        // Se houver vendas para o vendedor atual
        if (vendasVendedor.length > 0) {
          // Encontrar a última venda
          const ultimaVenda = vendasVendedor.reduce((prev, current) =>
            prev.Data_da_Venda > current.Data_da_Venda ? prev : current
          );

          // Construir o objeto combinando as propriedades de /vendedores e a última venda de /geral
          return {
            id: itemVendedor.id,
            vendedor: itemVendedor.Vendedor,
            cpf: itemVendedor.CPF_Vendedor,
            // Valor_de_Venda da última venda de /geral
            valor: ultimaVenda.Valor_de_Venda,
            ultimaVenda: ultimaVenda.Data_da_Venda,
            tipoVenda: ultimaVenda.tipoVendaProduto,
            foto: itemVendedor.Foto,
          };
        } else {
          // Se não houver vendas para o vendedor atual, defina o Valor_de_Venda como vazio
          return {
            id: itemVendedor.id,
            vendedor: itemVendedor.Vendedor.split(" ").slice(0, 2).join(" "),
            cpf: itemVendedor.CPF_Vendedor,
            valor: "", // Valor_de_Venda vazio
            ultimaVenda: "",
            tipoVenda: "",
            foto: itemVendedor.Foto,
          };
        }
      });

      setChartData(processedData);
      console.log(processedData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const saveChangesToDatabase = async (updatedRows: GridRowModel[]) => {
    try {
      console.log("Chamando função saveChangesToDatabase");

      // Mapeia os dados atualizados para o formato esperado pelo backend
      const updatedData = updatedRows.map((row) => ({
        id: row.id,
        Vendedor: row.vendedor,
        CPF_Vendedor: row.cpf,
      }));
      // Envia uma requisição PUT para o endpoint adequado no backend para realizar o update
      console.log("Updated Data OBJ: ");
      console.log(updatedData);
      await axios.put("http://localhost:8080/vendedores_update", updatedData);

      // Agora, para cada vendedor atualizado, também atualizamos as vendas associadas a ele
      updatedRows.forEach(async (row) => {
        const response = await axios.get(
          `http://localhost:8080/vendas?CPF_Vendedor=${row.cpf}`
        );
        const vendas = response.data;
        // Atualize as vendas associadas a esse vendedor
        const updatedVendas = vendas.map((venda) => ({
          ...venda,
          Vendedor: row.vendedor, // Atualize o nome do vendedor, se necessário
          // Atualize outras propriedades da venda, se necessário
        }));
        await axios.put("http://localhost:8080/vendas_update", updatedVendas);
      });

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
    const [mask, setMask] = useState('');

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

    const applyFilter = () => {
      const inputValue = filter;
      const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
      const hasReachedCPFLength = numericValue.length === 11;

      if (hasReachedCPFLength) {
        // Se o usuário digitou 11 dígitos, aplica a máscara de CPF
        const filteredRows = chartData.filter((row) =>
          row.cpf.startsWith(filter)
        );
        setRows(filteredRows);
      } else {
        // Se ainda não digitou 11 dígitos, não aplica a máscara
        const filteredRows = chartData.filter((row) =>
          row.vendedor.toLowerCase().startsWith(filter.toLowerCase())
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
        <div className="inputs-filtros">
     
          <div className="input-filtro">
            <img src={user_icon} alt="" />
              <InputMask
                mask={mask}
                type="text"
                placeholder="Busque por nome ou cpf do Vendedor"
                value={filter}
                onChange={event => {
                  const inputValue = event.target.value;
                  const firstChar = inputValue.charAt(0);
                  const isNumeric = !isNaN(firstChar); // Verifica se o primeiro caractere é um número
                  const numericValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
                  const hasReachedCPFLength = numericValue.length === 11;
                  
                  if (isNumeric) {
                    // Se o primeiro caractere for um número e o usuário digitou 11 dígitos, aplica a máscara de CPF
                    setMask('999.999.999-99');
                    console.log('É um número e tem 11 dígitos');
                  }else if(!isNumeric) {
                    // Se não for um número ou não digitou 11 dígitos, não aplica a máscara
                    setMask('');
                  }
                  
                  setFilter(inputValue); // Atualiza o filtro conforme o usuário digita
                }}
              />

          </div>

          <button onClick={applyFilter}><IoSearchSharp size={26} className="filtro-button" title="Buscar"/></button>
          <button onClick={limparFiltro}><TfiEraser size={26} className="filtro-button" title="Apagar Filtro"/></button>
      
        </div>
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
/*   const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
 */
  //alterar para modo visualização da linha quando o botão de salvar for clicado
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  //remover linha quando o botão deletar for clicado
  const handleDeleteClick = (id: GridRowId) => async () => {
    const confirm = window.confirm("Você tem certeza de que deseja excluir este vendedor?");
    if (confirm) {
      try {
        // Faz uma requisição DELETE para o backend para deletar o vendedor com o ID especificado
        await axios.delete(`http://localhost:8080/vendedores/${id}`);
        /* const response = await api.post("/users", {
        id
      }); */

      /* const response = await axios.post('http://localhost:3333/users/delete', { id }, {
         
        }); */

      // Atualiza o estado das linhas, removendo a linha deletada
        setRows(rows.filter((row) => row.id !== id));
        window.location.reload();
      } catch (error) {
        console.error("Erro ao deletar vendedor:", error);
      }
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
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    // Chama a função para salvar as mudanças no banco de dados
    await saveChangesToDatabase([updatedRow]);
    return updatedRow;
  };

  //manipulador de eventos chamado quando o modo da linha muda
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 40,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "foto",
      headerName: "",
      headerClassName: "super-app-theme--header",
      width: 60,
      align: "right",
      renderCell: (params) => (
          <img 
              src={params.value || perfilsemfoto} 
              style={{ width: 36, height: 36, borderRadius: '50%', marginTop: 7 }} 
          />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "vendedor",
      headerName: "Vendedor",
      headerClassName: "super-app-theme--header",
      width: 230,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "cpf",
      headerName: "CPF",
      headerClassName: "super-app-theme--header",
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "ultimaVenda",
      headerName: "Última Venda",
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
      headerName: "Valor da Venda",
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 190,
      align: "left",
      headerAlign: "left",
      editable: false,
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
      field: "tipoVenda",
      headerName: "Tipo de Venda",
      headerClassName: "super-app-theme--header",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: false,
      type: "singleSelect",
      valueOptions: ["Produto Novo", "Cliente Novo", "Produto Antigo"],
    },
    {
      field: "view",
      headerName: "",
      headerClassName: "super-app-theme--header",
      width: 80,
      renderCell: (params) => {
        const handleOpenProfile = () => 
          //aqui
        {
          selecionadoFunc(params.id)
          navigate(`/vendedores/${params.id}`);
        };
        return (
          <div className="viewButton" onClick={handleOpenProfile}>
            ABRIR
          </div>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      headerClassName: "super-app-theme--header",
      width: 10,
      cellClassName: "actions",
      getActions: ({ id }) => {

        //botões de editar e deletar
        return [
          <GridActionsCellItem
            icon={<AiOutlineUserDelete size={25} className="edit-button" />}
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

export default Vendedores;
