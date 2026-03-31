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
    { label: "Todos nuestros productos", path: "/todosnuestrosproductos" },
    { label: "Con qué productos trabajamos", path: "/conqueproductostrabajamos" },
    { label: "Acerca de nosotros", path: "/acercadenosotros" },
  ];

  return (
    <div>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setSort={setSort}
      />

      <div className="bg-white shadow p-4">
        {/* FILA SUPERIOR: MENU + BUSCADOR */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-outline h-20 flex-shrink-0 px-6 text-lg"
          >
            ☰
          </button>

          <input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1 h-20 min-w-[140px] px-6 text-lg"
          />
        </div>

        {/* FILA BOTONES */}
        <div className="flex gap-4 flex-wrap mt-4 transition-all duration-500 ease-in-out">
          {buttons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className="
                btn btn-outline
                h-20
                px-6
                flex-1 sm:flex-none
                min-w-[120px] sm:min-w-[200px]
                text-center
                text-lg
                whitespace-nowrap
                overflow-hidden
                rounded-lg
                shadow
                transition-all duration-500 ease-in-out
              "
              title={btn.label} // tooltip con texto completo
            >
              <span
                className="
                  block
                  w-full
                  truncate
                  text-[clamp(0.75rem,1vw,1.125rem)]
                "
              >
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
};

export default Layout;