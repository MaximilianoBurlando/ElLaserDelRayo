import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  setSort: (v: string) => void; // 👈 agregar
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ search, setSearch, setSort, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // ✅ SOLO ACÁ

  return (
    <div>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setSort={setSort}
      />
      <div className="bg-white shadow p-4 flex justify-between items-center">
        
        <button
          onClick={() => setSidebarOpen(true)}
          className="btn btn-outline"
        >
          ☰
        </button>

        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full max-w-[250px]"
        />

        <div className="flex gap-2">
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
            Todos Nuestros Productos
          </button>
          
          <button
            className="btn btn-outline"
            onClick={() => navigate("/conqueproductostrabajamos")}
          >
            Con que Productos Trabajamos
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/acercadenosotros")}
          >
            Acerca de nosotros
          </button>
        
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
};

export default Layout;