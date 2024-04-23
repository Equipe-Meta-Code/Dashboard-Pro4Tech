import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/baseLayout";
import Dashboard from "./screens/dashboard/dashboardScreen";
import PageNotFound from "./screens/error/pageNotFound";
import Vendedores from "./components/pages/vendedores/vendedoresScreen";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="vendedores" element={<Vendedores/>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
