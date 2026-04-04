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
  const [mode, setMode] = useState<"edges" | "smart" | "wood">("edges");
  const productEffects: Record<number, ("edges" | "smart" | "wood")[]> = {
    // 🟤 PRODUCTOS NEUTROS → permitir personalización completa
    1:[],2:[],3:[],4:[],5:[],7:[],16:[],
    6: ["edges", "smart"],
    8: ["edges", "smart"],
    9: ["edges", "smart"],
    10: ["edges", "smart"],
    11: ["edges", "smart"],

    12: ["edges", "smart"],

    13: ["edges", "smart"],
    14: ["edges", "smart"],
    15: ["edges", "smart"],

    17: ["edges", "smart"],

    // 🪵 más orientados a grabado
    18: ["wood", "edges", "smart"],
    19: ["wood", "edges", "smart"],
    20: ["wood", "edges", "smart"],

    // ❌ los demás (Boca, River, etc.) no se ponen → usan default
  };
  // 🔍 Buscar producto por ID
  const product = products.find((p) => p.id === Number(id));
  const allowedModes =
  product && productEffects[product.id]
    ? productEffects[product.id]
    : ["edges", "smart", "laser", "wood"];
  // 💬 Mensaje para WhatsApp
  const [message, setMessage] = useState("");
  const [gamma, setGamma] = useState(1.6);
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
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
    // 🌳 PALETA REAL (basada en tu imagen)
  const woodPalette = [
    { r: 210, g: 180, b: 140 }, // claro
    { r: 160, g: 110, b: 70 },  // medio
    { r: 110, g: 60, b: 30 },   // oscuro
    { r: 75, g: 40, b: 20 },    // quemado
  ];
  // 📌 Inicializar mensaje cuando carga el producto
    useEffect(() => {
      if (product) {
        setMessage(`Hola! Estoy interesado en "${product.name}"`);
      }
    }, [product]);
    //camara
    const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" } // frontal en celular
      });

      setVideoStream(stream);
      setShowCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accediendo a la cámara:", err);
    }
  };
  const stopCamera = () => {
    videoStream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };
  const takePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setUploadedImage(imageData); // 🔥 esto lo mete directo a tu flujo actual

    stopCamera();
  };
/* 🎯 función para interpolar dentro de la paleta
const getWoodColor = (t: number) => {
  const scaled = t * (woodPalette.length - 1);
  const index = Math.floor(scaled);
  const frac = scaled - index;

  const c1 = woodPalette[index];
  const c2 = woodPalette[Math.min(index + 1, woodPalette.length - 1)];

  return {
      r: c1.r + (c2.r - c1.r) * frac,
      g: c1.g + (c2.g - c1.g) * frac,
      b: c1.b + (c2.b - c1.b) * frac,
    };
  };*/
  //convertir imagen en tallado detallado
  const convertToWoodLaserFinal = (imageSrc: string): Promise<string> => {
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
      const height = canvas.height;

      const blockSize = 3;

      /* 🌳 PALETA MÁS MARRÓN (ajustada)
      const woodPalette = [
        { r: 225, g: 185, b: 135 }, // claro más cálido
        { r: 175, g: 115, b: 65 },  // medio más marrón
        { r: 120, g: 65, b: 35 },   // oscuro más intenso
        { r: 85, g: 45, b: 25 },    // quemado cálido
      ];*/

      const getWoodColor = (t: number) => {
        const scaled = t * (woodPalette.length - 1);
        const index = Math.floor(scaled);
        const frac = scaled - index;

        const c1 = woodPalette[index];
        const c2 = woodPalette[Math.min(index + 1, woodPalette.length - 1)];

        return {
          r: c1.r + (c2.r - c1.r) * frac,
          g: c1.g + (c2.g - c1.g) * frac,
          b: c1.b + (c2.b - c1.b) * frac,
        };
      };

      for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {

          let sum = 0;
          let count = 0;

          for (let by = 0; by < blockSize; by++) {
            for (let bx = 0; bx < blockSize; bx++) {
              const px = x + bx;
              const py = y + by;

              if (px >= width || py >= height) continue;

              const i = (py * width + px) * 4;

              const gray =
                0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];

              sum += gray;
              count++;
            }
          }

          let avgGray = sum / count;

          // ☀️ gamma
          avgGray = 255 * Math.pow(avgGray / 255, 1 / gamma);

          // ✂️ eliminar blancos
          if (avgGray > 200) {
            for (let by = 0; by < blockSize; by++) {
              for (let bx = 0; bx < blockSize; bx++) {
                const px = x + bx;
                const py = y + by;

                if (px >= width || py >= height) continue;

                const i = (py * width + px) * 4;
                data[i + 3] = 0;
              }
            }
            continue;
          }

          // 🔥 contraste
          const contrast = 1.2;
          const adjusted = Math.min(
            255,
            Math.max(0, (avgGray - 128) * contrast + 128)
          );

          let intensity = adjusted / 255;

          // 🔥 evitar negro puro
          intensity = Math.max(intensity, 0.08);

          const t = 1 - intensity;

          let { r, g, b } = getWoodColor(t);

          // 🎯 DESATURACIÓN MÁS SUAVE (clave)
          const mid = 0.5;
          const desatFactor = Math.abs(intensity - mid) * 1.3; // antes 2 → ahora menos gris

          const grayMix = (r + g + b) / 3;

          r = r * (1 - (1 - desatFactor) * 0.6) + grayMix * (1 - desatFactor) * 0.6;
          g = g * (1 - (1 - desatFactor) * 0.6) + grayMix * (1 - desatFactor) * 0.6;
          b = b * (1 - (1 - desatFactor) * 0.6) + grayMix * (1 - desatFactor) * 0.6;

          // 🌧️ líneas láser
          const lineStrength = (y % 6 === 0) ? 0.9 : 1;
          r *= lineStrength;
          g *= lineStrength;
          b *= lineStrength;

          // 🌲 ruido leve
          const noise = (Math.random() - 0.5) * 6;
          r += noise;
          g += noise;
          b += noise;

          // 🎨 pintar
          for (let by = 0; by < blockSize; by++) {
            for (let bx = 0; bx < blockSize; bx++) {
              const px = x + bx;
              const py = y + by;

              if (px >= width || py >= height) continue;

              const i = (py * width + px) * 4;

              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
              data[i + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
  });
};
  /*convertir imagen a tallado
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
  };*/
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
            output[i] = 0;
            output[i + 1] = 0;
            output[i + 2] = 0;
            output[i + 3] = 255;
          } else {
            output[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(new ImageData(output, canvas.width, canvas.height), 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
  });
};
  const convertToSmartEdges = (imageSrc: string): Promise<string> => {
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
      const height = canvas.height;

      const output = new Uint8ClampedArray(data.length);

      // 👉 grayscale
      const grayData = new Float32Array(width * height);

      for (let i = 0; i < data.length; i += 4) {
        grayData[i / 4] =
          0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      }

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          const idx = i * 4;

          const center = grayData[i];

          // 🔥 detectar variación con vecinos
          const diff =
            Math.abs(center - grayData[i - 1]) +
            Math.abs(center - grayData[i + 1]) +
            Math.abs(center - grayData[i - width]) +
            Math.abs(center - grayData[i + width]);

          // 🔥 detectar bordes (tipo Sobel simplificado)
          const edge = diff > 100;

          // 🔥 detectar bloque uniforme (tipo QR)
          const isUniform = diff < 20;

          // 🔥 detectar oscuro (rellenable)
          const isDark = center < 140;

          if (edge) {
            // línea
            output[idx] = 0;
            output[idx + 1] = 0;
            output[idx + 2] = 0;
            output[idx + 3] = 255;
          } else if (isUniform && isDark) {
            // 🔥 BLOQUE COMPLETO (tipo QR)
            output[idx] = 0;
            output[idx + 1] = 0;
            output[idx + 2] = 0;
            output[idx + 3] = 255;
          } else {
            // transparente
            output[idx + 3] = 0;
          }
        }
      }

      ctx.putImageData(new ImageData(output, width, height), 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
  });
};
  // 🔄 PROCESAR AUTOMÁTICAMENTE CUANDO SE SUBE IMAGEN
  useEffect(() => {
    if (!uploadedImage) return;

    const process = async () => {
      try {
        let result: string | null = null;

        if (mode === "edges") {
          result = await convertToEdgesTransparent(uploadedImage);
        } else if (mode === "smart") {
          result = await convertToSmartEdges(uploadedImage);
        } else if (mode === "wood") {
          result = await convertToWoodLaserFinal(uploadedImage);
        }
        setProcessedImg(result);
      } catch (err) {
        console.error("Error procesando imagen:", err);
      }
    };

    process();
  }, [uploadedImage, mode, gamma]);
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
            <label><center>¡ADVERTENCIA!</center><br/>Esto es solo una aproximación <br/>
              ¡Consúltenos para mostrarle una muestra real!</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            <button
              onClick={startCamera}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded-xl"
            >
              Usar cámara
            </button>
            <div>
              <label>Modo de procesamiento</label>
              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "edges" | "smart" | "wood")
                }
                className="w-full border rounded-xl p-2"
              >
                {allowedModes.includes("edges") && (
                  <option value="edges">Solo líneas</option>
                )}

                {allowedModes.includes("smart") && (
                  <option value="smart">Líneas + relleno inteligente</option>
                )}

                {allowedModes.includes("wood") && (
                  <option value="wood">Grabado madera (realista)</option>
                )}
              </select>
            </div>
{showCamera && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
    
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-80 rounded-xl mb-4"
    />

    <div className="flex gap-4">
      <button
        onClick={takePhoto}
        className="bg-green-600 text-white px-4 py-2 rounded-xl"
      >
        📸 Sacar foto
      </button>

        <button
          onClick={stopCamera}
          className="bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  )}
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
            <div>
              <label>Gamma / Brillo ({gamma.toFixed(1)})</label>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={gamma}
                onChange={(e) => setGamma(Number(e.target.value))}
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