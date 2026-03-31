import React from "react";
import productsData from "../data/products.json";
import { useNavigate } from "react-router-dom";

// Tipos
export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
};

const ids = [5, 2];

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
      className="border rounded-2xl shadow p-4 cursor-pointer hover:scale-105 transition active:scale-95"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-xl"
      />
      <h2 className="text-sm sm:text-base font-semibold mt-2">{product.name}</h2>
    </div>
  );
};

// Grid
const ProductGrid: React.FC<{
  search: string;
  sort: string;
}> = ({ search, sort }) => {
  
  const filteredProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
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
      }}
    >
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          style={{
            aspectRatio: "1 / 1", // 🔹 asegura que sea cuadrado
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

// Página
export default function ProductsGrid({ filters }: { filters: Filters }) {
  const { search, sort } = filters;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        El Rayo Del Laser
      </h1>

      <ProductGrid search={search} sort={sort} />
    </div>
  );
}