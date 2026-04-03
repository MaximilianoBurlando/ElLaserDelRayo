import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productsData from "../data/products.json";

// 🧩 Tipo de producto (tipado fuerte para evitar errores)
type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
};

// 📲 Número de WhatsApp desde variables de entorno
const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;

// 📦 Lista de productos tipada
const products = productsData as Product[];

const ProductPage: React.FC = () => {
  // 🔎 Obtener ID desde la URL
  const { id } = useParams<{ id: string }>();
  const productEffects: Record<number, "wood" | "edges"> = {
    /*18: "wood",
    19: "wood",
    20: "wood",*/
  };
  // 🔍 Buscar producto por ID
  const product = products.find((p) => p.id === Number(id));

  // 💬 Mensaje para WhatsApp
  const [message, setMessage] = useState("");

  // 🖼️ Imagen subida por el usuario (base64)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // 🎨 Imagen procesada (blanco y negro)
  const [processedImg, setProcessedImg] = useState<string | null>(null);

  // 📍 Posición del diseño dentro del contenedor
  const [position, setPosition] = useState({ x: 100, y: 100 });

  // 🖱️ Estado de arrastre
  const [dragging, setDragging] = useState(false);

  // 🔍 Escala del diseño
  const [scale, setScale] = useState(1);

  // 🔄 Rotación del diseño
  const [rotation, setRotation] = useState(0);

  // 📌 Inicializar mensaje cuando carga el producto
  useEffect(() => {
    if (product) {
      setMessage(`Hola! Estoy interesado en "${product.name}"`);
    }
  }, [product]);

  // 📂 SUBIR IMAGEN
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    // Convertimos la imagen a base64
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };
  //convertir imagen a tallado
  const convertToLaserTransparent = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const width = canvas.width;

        // 👉 grayscale
        for (let i = 0; i < data.length; i += 4) {
          const gray =
            0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = gray;
        }

        // 🔥 dithering + transparencia
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * width + x) * 4;

            const oldPixel = data[i];
            const newPixel = oldPixel < 128 ? 0 : 255;

            const error = oldPixel - newPixel;

            // 🔥 SI ES OSCURO → QUEMADO
            if (newPixel === 0) {
              data[i] = 0;
              data[i + 1] = 0;
              data[i + 2] = 0;
              data[i + 3] = 255; // visible
            } else {
              // 🔥 SI ES CLARO → TRANSPARENTE
              data[i + 3] = 0;
            }

            // distribuir error (Floyd-Steinberg)
            const distribute = (index: number, factor: number) => {
              if (data[index] !== undefined) {
                data[index] += error * factor;
              }
            };

            distribute(i + 4, 7 / 16);
            distribute(i + width * 4 - 4, 3 / 16);
            distribute(i + width * 4, 5 / 16);
            distribute(i + width * 4 + 4, 1 / 16);
          }
        }

        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL("image/png")); // 👈 CLAVE
      };
    });
  };
  //convertir imagen a lineas
  const convertToEdgesTransparent = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const width = canvas.width;
      const output = new Uint8ClampedArray(data.length);

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const i = (y * width + x) * 4;

          const gx =
            -data[i - 4 - width * 4] - 2 * data[i - 4] - data[i - 4 + width * 4] +
            data[i + 4 - width * 4] + 2 * data[i + 4] + data[i + 4 + width * 4];

          const gy =
            -data[i - width * 4 - 4] - 2 * data[i - width * 4] - data[i - width * 4 + 4] +
            data[i + width * 4 - 4] + 2 * data[i + width * 4] + data[i + width * 4 + 4];

          const magnitude = Math.sqrt(gx * gx + gy * gy);

          if (magnitude > 80) {
            // 🔥 línea visible (negro)
            output[i] = 0;
            output[i + 1] = 0;
            output[i + 2] = 0;
            output[i + 3] = 255; // opaco
          } else {
            // 🔥 fondo transparente
            output[i] = 0;
            output[i + 1] = 0;
            output[i + 2] = 0;
            output[i + 3] = 0; // TRANSPARENTE
          }
        }
      }

      ctx.putImageData(new ImageData(output, canvas.width, canvas.height), 0, 0);

      // 🔥 exporta PNG con transparencia
      resolve(canvas.toDataURL("image/png"));
    };
  });
};

  // 🔄 PROCESAR AUTOMÁTICAMENTE CUANDO SE SUBE IMAGEN
  useEffect(() => {
    if (!uploadedImage || !product) return;

    const process = async () => {
      const effect = productEffects[product.id] || "edges";

      let result;

      if (effect === "wood") {
        result = await convertToLaserTransparent(uploadedImage);
      } else {
        result = await convertToEdgesTransparent(uploadedImage);
      } 

      setProcessedImg(result);
    };

    process();
  }, [uploadedImage, product]);

  // 🔥 FUNCIÓN DE MOVIMIENTO CON LÍMITES (CLAMP)
  const handleMove = (clientX: number, clientY: number) => {
    const container = document.getElementById("editor-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Coordenadas relativas al contenedor
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Tamaño del diseño según escala
    const imgSize = 100 * scale;

    // Límites para que no se salga
    const minX = imgSize / 2;
    const maxX = rect.width - imgSize / 2;

    const minY = imgSize / 2;
    const maxY = rect.height - imgSize / 2;

    // Clamp (encerrar dentro del área)
    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    setPosition({ x, y });
  };

  // 🔥 SISTEMA DE DRAG GLOBAL (mouse + touch)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    // Al soltar → dejar de arrastrar
    const stopDragging = () => setDragging(false);

    // Eventos globales
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDragging);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [dragging, scale]);

  // 📲 ENVIAR A WHATSAPP
  const handleSend = () => {
    if (!message || !product) return;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  // ❌ Si no existe producto
  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* 🖼️ EDITOR DE IMAGEN */}
        <div>
          <div
            id="editor-container"
            className="relative w-full h-60 sm:h-72 md:h-80 overflow-hidden"
          >
            {/* 🧱 Imagen base del producto */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl shadow"
            />

            {/* 🎨 Diseño del usuario */}
            {processedImg && (
              <img
                src={processedImg}
                draggable={false} // evita drag nativo
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={(e) => {
                  e.preventDefault(); // evita selección
                  e.stopPropagation();
                  setDragging(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setDragging(true);
                }}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  width: 100,
                  cursor: dragging ? "grabbing" : "grab",
                  touchAction: "none",
                  userSelect: "none",
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`
                }}
              />
            )}
          </div>

          {/* 🎛️ CONTROLES */}
          <div className="mt-4 space-y-2">
            <label>Esto es solo una aproximacion<br/>
              Consultenos para mostrarle una muestra real!</label>
            <input type="file" accept="image/*" onChange={handleUpload} />

            {/* Escala */}
            <div>
              <label>Escala</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
            </div>

            {/* Rotación */}
            <div>
              <label>Rotación</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* 📄 INFO DEL PRODUCTO */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          {/* 📲 BLOQUE WHATSAPP */}
          <div className="mt-4 border rounded-2xl p-4">
            <h2 className="font-semibold mb-2">
              Consultar por este producto
            </h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-xl p-2 mb-3"
            />

            <button
              onClick={handleSend}
              disabled={!message}
              className={`w-full px-6 py-2 rounded-xl text-white ${
                message
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400"
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