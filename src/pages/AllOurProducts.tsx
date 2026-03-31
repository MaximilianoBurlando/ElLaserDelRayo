import React from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/products.json";

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
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 sm:h-40 md:h-40 object-cover rounded-xl"
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
  let filteredProducts = products
    .filter((p) =>
      (p.name + p.description).toLowerCase().includes(search.toLowerCase())
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
            aspectRatio: "1 / 1", // tarjeta cuadrada
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

// Página
export default function AllOurProducts({ filters }: { filters: Filters }) {
  const { search, sort } = filters;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Todos nuestros productos</h1>
      <ProductGrid search={search} sort={sort} />
    </div>
  );
}