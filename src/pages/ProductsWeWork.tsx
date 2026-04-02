import React from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/products.json";

const ids = [8, 9, 10, 11, 12];

// Tipos
export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
};

type Filters = {
  search: string;
  sort: string;
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
};

const products = productsData as Product[];

// Card
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/producto/${product.id}`)}
      className="border rounded-2xl shadow p-4 cursor-pointer hover:scale-105 active:scale-95 transition flex flex-col"
      style={{ borderColor: "#444" }} // 🔹 borde gris oscuro suave
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 sm:h-40 md:h-40 object-cover rounded-xl"
      />
      <h2 className="text-sm sm:text-base font-semibold mt-2">
        {product.name}
      </h2>
    </div>
  );
};

// Grid
const ProductGrid: React.FC<{
  search: string;
  sort: string;
}> = ({ search, sort }) => {
  const baseProducts: Product[] =
    ids.length > 0
      ? ids
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined)
      : products;

  let filteredProducts = baseProducts.filter((p) =>
    (p.name + p.description).toLowerCase().includes(search.toLowerCase())
  );

  filteredProducts = filteredProducts.sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "za") return b.name.localeCompare(a.name);
    if (sort === "mas-vendido") return b.id - a.id;
    return 0;
  });

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        maxWidth: "calc(4 * 1fr)", // 🔹 límite máximo de 4 columnas
      }}
    >
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          style={{ aspectRatio: "1 / 1" }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

// Página
export default function ProductsWeWork({ filters }: { filters: Filters }) {
  const { search, sort } = filters;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Con qué productos trabajamos
      </h1>
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
      <ProductGrid search={search} sort={sort} />
    </div>
  );
}