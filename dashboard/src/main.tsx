import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { SidebarProvider } from "./context/sideBarContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import PageNotFound from "./screens/error/pageNotFound.tsx";
import Cadastro from "./components/pages/cadastro/Cadastro.tsx";
import Login from "./components/pages/login/Login.tsx";

/* const router = createBrowserRouter ([
  {
    errorElement: <PageNotFound />,

    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/cadastro',
        element: <Cadastro />
      },
      {
        path: '/dashboard',
        element: <App />
      }
    ]
  }
]); */

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);

