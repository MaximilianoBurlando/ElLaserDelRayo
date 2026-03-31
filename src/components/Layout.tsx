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

  const buttons = [
    { label: "Inicio", path: "/" },
    { label: "Productos", path: "/todosnuestrosproductos" },
    { label: "Materiales", path: "/conqueproductostrabajamos" },
    { label: "Acerca de nosotros", path: "/acercadenosotros" },
  ];

  return (
    <div>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setSort={setSort}
      />

      <div className="bg-white shadow p-3 sm:p-4">
        {/* FILA SUPERIOR: MENU + BUSCADOR */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* ☰ MENU */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-outline h-8 flex-shrink-0 px-2"
          >
            ☰
          </button>

          {/* BUSCADOR */}
          <input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1 h-8 min-w-[80px] px-2"
          />
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          {buttons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className="
                btn btn-outline 
                flex-1 
                flex-grow 
                flex-shrink 
                min-w-[70px] 
                h-8 
                px-2 
                flex 
                justify-center 
                items-center 
                truncate
              "
              title={btn.label} // tooltip con texto completo
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Layout;