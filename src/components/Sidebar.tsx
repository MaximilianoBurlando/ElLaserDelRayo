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
      </div>
    </>
  );
};

export default Sidebar;