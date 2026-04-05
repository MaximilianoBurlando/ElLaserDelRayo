export default function AboutUs() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      
      <h1 className="text-3xl font-bold mb-4">
        El Rayo Del Laser
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
      <p className="text-gray-700 mb-4">
        Bienvenido a El Rayo Del Laser. Nos especializamos en productos
        personalizados realizados con tecnología de corte y grabado láser.
      </p>

      <p className="text-gray-700 mb-4">
        Trabajamos con materiales de alta calidad para ofrecer diseños únicos,
        ideales para regalos, decoración o uso personal.
      </p>

      <p className="text-gray-700">
        Nuestro objetivo es brindarte productos originales y personalizados
        que se adapten a tus necesidades.
      </p>
      <br/>
      <p className="text-gray-700">
        Correo del Creador de la página:{" "}
        <a
          href="https://mail.google.com/mail/?view=cm&to=burlandomaxi@gmail.com&su=Consulta%20sobre%20producto&body=Hola,%20quiero%20información%20sobre..."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 rounded-full text-white font-semibold 
                    bg-blue-600 hover:bg-blue-700 
                    hover:scale-105 transition transform"
        >
          burlandomaxi@gmail.com
        </a>
      </p>

    </div>
  );
}