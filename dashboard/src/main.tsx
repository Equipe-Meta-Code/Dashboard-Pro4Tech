import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Login from "./pages/login/Login.tsx";
import PageNotFound from "./screens/error/pageNotFound.tsx";
import Cadastro from "./pages/cadastro/Cadastro.tsx";

const router = createBrowserRouter ([
  {
    path: '/',
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
          <RouterProvider router={router} />
    </React.StrictMode>
);

