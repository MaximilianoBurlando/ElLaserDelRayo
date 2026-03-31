import React from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/products.json";

const ids = [1, 3];

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
      onClick={() => navigate(`/product/${product.id}`)}
      className="border rounded-2xl shadow p-3 cursor-pointer hover:scale-105 active:scale-95 transition"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-xl"
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

  // 1️⃣ Base: usar ids si existen
  let baseProducts: Product[] =
    ids.length > 0
      ? ids
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined)
      : products;

  // 2️⃣ Filtro por búsqueda
  let filteredProducts = baseProducts.filter((p) =>
    (p.name + p.description)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 3️⃣ Orden
  filteredProducts = filteredProducts.sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "za") return b.name.localeCompare(a.name);
    if (sort === "mas-vendido") return b.id - a.id;
    return 0;
  });

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
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

      <ProductGrid search={search} sort={sort} />
    </div>
  );
}