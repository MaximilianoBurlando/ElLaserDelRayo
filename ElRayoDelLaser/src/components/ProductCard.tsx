import { Product } from "../types/Product";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="border rounded-2xl shadow p-4 bg-white">
      <img src={product.image} className="w-full h-40 object-cover" />
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  );
};

export default ProductCard;