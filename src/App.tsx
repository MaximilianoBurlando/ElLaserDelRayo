import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsGrid from "./pages/ProductsGrid.tsx";
import AllOurProducts from "./pages/AllOurProducts.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import ProductsWeWork from "./pages/ProductsWeWork.tsx";
import Product from "./pages/Product.tsx"
import "./index.css";

type Filters = {
  search: string;
  sort: string;
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
};

function App() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sort: "",
    categories: [],
    minPrice: null,
    maxPrice: null,
  });

  // sincronizar search → filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: search,
    }));
  }, [search]);

  // sincronizar sort → filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      sort: sort,
    }));
  }, [sort]);

  return (
    <BrowserRouter>
      <Layout
        search={search}
        setSearch={setSearch}
        setSort={setSort}
      >
        <Routes>
          <Route path="/" element={<ProductsGrid filters={filters} />} />
          
          <Route path="/producto/:id" element={<Product />} />
          
          <Route
            path="/todosnuestrosproductos"
            element={<AllOurProducts filters={filters} />}
          />

          <Route
            path="/conqueproductostrabajamos"
            element={<ProductsWeWork filters={filters} />}
          />

          <Route path="/acercadenosotros" element={<AboutUs />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;