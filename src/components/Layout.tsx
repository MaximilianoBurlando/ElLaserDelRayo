import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  setSort: (v: string) => void;
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ search, setSearch, setSort, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setSort={setSort}
      />

      {/* 🔥 NAVBAR */}
      <div className="bg-white shadow p-3 sm:p-4 flex items-center justify-between gap-2">
        
        {/* ☰ MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="btn btn-outline"
        >
          ☰
        </button>

        {/* 🔍 BUSCADOR */}
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full max-w-[150px] sm:max-w-[250px]"
        />

        {/* 💻 BOTONES SOLO EN DESKTOP */}
        <div className="hidden md:flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/")}
          >
            Inicio
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/todosnuestrosproductos")}
          >
            Todos
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/conqueproductostrabajamos")}
          >
            Productos
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/acercadenosotros")}
          >
            Nosotros
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Layout;