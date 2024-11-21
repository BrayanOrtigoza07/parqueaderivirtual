import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-6">
        Bienvenidos al parqueadero de la Universidad de Cundinamarca
      </h1>
      <Link href="/registro">
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
          Quiero ingresar
        </button>
      </Link>
    </div>
  );
}
