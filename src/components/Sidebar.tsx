import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  setSort: (v: string) => void;
};

const Sidebar: React.FC<Props> = ({ open, onClose, setSort }) => {
  return (
    <>
      {/* Overlay oscuro */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Filtros</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <p>Ordenar por:</p>
          <button className="btn btn-outline" 
          onClick={() => setSort("mas-vendido")}>
            Principal
          </button>
          <button className="btn btn-outline" onClick={() => setSort("az")}>
            Ordenar A-Z
          </button>
          <button className="btn btn-outline" onClick={() => setSort("za")}>
            Ordenar Z-A
          </button>
        </div>
        <div className="flex flex-col items-center gap-3 mt-2 mb-6">

          {/* Instagram */}
          <a
            href="https://www.instagram.com/elrayodellaser?igsh=MXc5aTN4MjMxa215dg=="
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full text-white font-semibold 
                      bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
                      hover:scale-105 transition transform"
          >
            📸 Seguinos en Instagram
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/TU_PAGINA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full text-white font-semibold 
                      bg-blue-600 hover:bg-blue-700 
                      hover:scale-105 transition transform"
          >
            👍 Seguinos en Facebook
          </a>

        </div>
      </div>
    </>
  );
};

export default Sidebar;