import Link from 'next/link';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://www.enter.co/wp-content/uploads/2013/12/Parqueadero-660x432.jpg')`,
      }}
    >
      {/* Franja superior */}
      <div className="w-full bg-green-700 py-4 flex items-center justify-center relative">
        <img
          src="https://techiocomunitario.org/wp-content/uploads/2023/01/ESCUDO-COLOR-H.png"
          alt="Escudo"
          className="absolute left-4 h-16"
        />
        <h1 className="text-white text-3xl font-bold text-center">
          Parqueadero Universidad de Cundinamarca
        </h1>
      </div>

      {/* Contenido central */}
      <div className="flex flex-col items-center justify-center text-center mt-20">
        <h2 className="text-white text-4xl font-extrabold mb-8 shadow-lg bg-opacity-50 bg-black px-4 py-2 rounded">
          Bienvenidos al parqueadero de la Universidad de Cundinamarca
        </h2>
        <Link href="/registro">
          <button className="px-8 py-4 bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-600 transition-transform transform hover:scale-105">
            Quiero ingresar
          </button>
        </Link>
      </div>

      {/* Espaciador para un diseño balanceado */}
      <div className="mb-16"></div>
    </div>
  );
}
