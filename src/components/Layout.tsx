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
      <div className="bg-white shadow p-3 sm:p-4 flex flex-col gap-2">

    {/* 🔝 FILA SUPERIOR */}
    <div className="flex items-center gap-2">
      
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
        className="input flex-1"
      />
    </div>

    {/* 🔽 FILA INFERIOR (BOTONES) */}
    <div className="flex gap-2 overflow-x-auto">
      
      <button
        className="btn btn-outline whitespace-nowrap"
        onClick={() => navigate("/")}
      >
        <span className="sm:hidden">Inicio</span>
        <span className="hidden sm:inline">Inicio</span>
      </button>

      <button
        className="btn btn-outline whitespace-nowrap"
        onClick={() => navigate("/todosnuestrosproductos")}
      >
        <span className="sm:hidden">Todos</span>
        <span className="hidden sm:inline">Todos nuestros productos</span>
      </button>

      <button
        className="btn btn-outline whitespace-nowrap"
        onClick={() => navigate("/conqueproductostrabajamos")}
      >
        <span className="sm:hidden">Prod</span>
        <span className="hidden sm:inline">Con qué productos trabajamos</span>
      </button>

      <button
        className="btn btn-outline whitespace-nowrap"
        onClick={() => navigate("/acercadenosotros")}
      >
        <span className="sm:hidden">Nos</span>
        <span className="hidden sm:inline">Acerca de nosotros</span>
      </button>
    </div>
  </div>

      {/* CONTENIDO */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Layout;