import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/baseLayout";
import Dashboard from "./screens/dashboard/dashboardScreen";
import PageNotFound from "./screens/error/pageNotFound";
import Vendedores from "./components/pages/tabelas/vendedoresScreen";
import { useEffect } from "react";
import Vendas from "./components/pages/tabelas/vendasScreen";

function App() {

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Dashboard />} />
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
