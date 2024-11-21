'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Gym() {
  return (
    <Suspense fallback={<div>Cargando página del parqueadero...</div>}>
      <GymContent />
    </Suspense>
  );
}

function GymContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener parámetros desde la URL
  const userData = {
    name: searchParams.get('name') || '',
    role: searchParams.get('role') || '',
    plate: searchParams.get('plate') || '',
  };

  const parkingLot = { name: 'Parqueadero Gym', spaces: 10 };

  const [spaces, setSpaces] = useState(
    Array.from({ length: parkingLot.spaces }, (_, i) => ({
      id: i + 1,
      status: i % 3 === 0 ? 'Ocupado' : 'Disponible',
    }))
  );

  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSpaceSelect = (id: number) => {
    setSelectedSpace(id);
  };

  const handleConfirm = () => {
    if (!selectedSpace) {
      alert('Por favor, selecciona un espacio.');
      return;
    }

    // Actualizar el estado del espacio seleccionado
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) =>
        space.id === selectedSpace ? { ...space, status: 'Ocupado' } : space
      )
    );

    setIsConfirmed(true);

    // Redirigir automáticamente después de 3 segundos
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-green-600 mb-4">¡Gracias por su ingreso!</h1>
        <p className="mb-6">Lo esperamos a la salida.</p>
        <div className="bg-white p-6 rounded shadow-md text-left">
          <h2 className="text-xl font-bold mb-4">Detalles del Registro</h2>
          <p><strong>Nombre:</strong> {userData.name}</p>
          <p><strong>Rol:</strong> {userData.role}</p>
          <p><strong>Placa:</strong> {userData.plate}</p>
          <p><strong>Parqueadero:</strong> {parkingLot.name}</p>
          <p><strong>Espacio:</strong> {selectedSpace}</p>
          <p><strong>Hora:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{parkingLot.name}</h1>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => handleSpaceSelect(space.id)}
            disabled={space.status === 'Ocupado'}
            className={`p-4 border rounded text-center font-bold ${
              space.status === 'Disponible'
                ? selectedSpace === space.id
                  ? 'bg-blue-300 text-white'
                  : 'bg-green-200'
                : 'bg-red-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {space.status === 'Disponible' ? `Espacio ${space.id}` : 'Ocupado'}
          </button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Confirmar espacio
        </button>
      </div>
    </div>
  );
}
