import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/baseLayout";
import Dashboard from "./screens/dashboard/dashboardScreen";
import PageNotFound from "./screens/error/pageNotFound";
import Vendedores from "./components/pages/tabelas/vendedoresScreen";
import { useEffect } from "react";
import Vendas from "./components/pages/tabelas/vendasScreen";
import { Login, Cadastro } from "./components";
import Comissao from "./components/pages/tabelas/comissaoScreen";

function App() {

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<BaseLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/comissões" element={<Comissao />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="vendedores" element={<Vendedores />} />
            <Route path="vendas" element={<Vendas />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
