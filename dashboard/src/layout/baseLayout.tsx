import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";

const BaseLayout = () => {
  return (
    <main className="page-wrapper">
      {/* esquerda da página */}
      <Sidebar />
      {/* direita da página */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
