import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productsData from "../data/products.json";

// Tipo
type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
};

const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;

const products = productsData as Product[];

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const product = products.find((p) => p.id === Number(id));

  const [message, setMessage] = useState("");

  // 🔥 Esto arregla el problema de inicialización
  useEffect(() => {
    if (product) {
      setMessage(`Hola! Estoy interesado en "${product.name}"`);
    }
  }, [product]);

  const handleSend = () => {
    if (!message || !product) return;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      
      {/* 🔥 Layout responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Imagen */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-2xl shadow"
        />

        <div>
          {/* Título */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
            {product.name}
          </h1>

          {/* Descripción */}
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            {product.description}
          </p>

          {/* BLOQUE WHATSAPP */}
          <div className="mt-4 border rounded-2xl p-4">
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              Consultar por este producto
            </h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej: quiero 2 unidades"
              className="w-full border rounded-xl p-2 mb-3 text-sm sm:text-base"
            />

            <button
              onClick={handleSend}
              disabled={!message}
              className={`w-full px-6 py-2 rounded-xl text-white transition ${
                message
                  ? "bg-green-600 hover:bg-green-700 active:scale-95"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;