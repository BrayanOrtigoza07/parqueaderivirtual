'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AgronomiaPage() {
  return (
    <Suspense fallback={<div>Cargando página del parqueadero...</div>}>
      <AgronomiaContent />
    </Suspense>
  );
}

function AgronomiaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userData = {
    name: searchParams.get('name') || 'Usuario Anónimo',
    role: searchParams.get('role') || 'No especificado',
    plate: searchParams.get('plate') || 'Sin placa',
  };

  const selectedParkingLot = 'Parqueadero Agronomía';
  const totalSpaces = 12;

  const [spaces, setSpaces] = useState<{ id: number; status: string }[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchOccupiedSpaces = async () => {
      try {
        const response = await fetch('/api/parking');
        if (response.ok) {
          const data = await response.json();
          const occupiedSpaces = data
            .filter((entry: { parking_lot: string; space: number }) => entry.parking_lot === selectedParkingLot)
            .map((entry: { space: number }) => entry.space);

          setSpaces(
            Array.from({ length: totalSpaces }, (_, i) => ({
              id: i + 1,
              status: occupiedSpaces.includes(i + 1) ? 'Ocupado' : 'Disponible',
            }))
          );
        } else {
          console.error('Error al cargar los espacios:', await response.text());
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
      }
    };

    fetchOccupiedSpaces();
  }, []);

  const handleSpaceSelect = (id: number) => {
    setSelectedSpace(id);
  };

  const handleConfirm = async () => {
    if (!selectedSpace) {
      alert('Por favor, selecciona un espacio.');
      return;
    }

    const body = {
      name: userData.name,
      role: userData.role,
      plate: userData.plate,
      parkingLot: selectedParkingLot,
      space: selectedSpace,
    };

    try {
      const response = await fetch('/api/parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space.id === selectedSpace ? { ...space, status: 'Ocupado' } : space
          )
        );
        setIsConfirmed(true);

        // Redirigir automáticamente después de 4 segundos
        setTimeout(() => {
          router.push('/');
        }, 4000);
      } else {
        console.error('Error al registrar el espacio:', await response.text());
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-6 mb-6">
          <h1 className="text-5xl font-extrabold text-green-600 text-center">
            ¡Gracias por su ingreso!
          </h1>
          <img
            src="https://media1.tenor.com/m/atRVxzCTOVYAAAAC/neon-sign-neon.gif"
            alt="Neon Sign"
            className="w-32 h-32"
          />
        </div>
        <p className="text-xl text-gray-700 mb-8">Lo esperamos a la salida.</p>
        <div className="bg-white p-8 rounded shadow-lg text-left w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Detalles del Registro
          </h2>
          <div className="text-lg space-y-3">
            <p>
              <strong className="text-gray-700">Nombre:</strong>{' '}
              <span className="text-gray-900">{userData.name}</span>
            </p>
            <p>
              <strong className="text-gray-700">Rol:</strong>{' '}
              <span className="text-gray-900">{userData.role}</span>
            </p>
            <p>
              <strong className="text-gray-700">Placa:</strong>{' '}
              <span className="text-gray-900">{userData.plate}</span>
            </p>
            <p>
              <strong className="text-gray-700">Parqueadero:</strong>{' '}
              <span className="text-gray-900">{selectedParkingLot}</span>
            </p>
            <p>
              <strong className="text-gray-700">Espacio:</strong>{' '}
              <span className="text-gray-900">{selectedSpace}</span>
            </p>
            <p>
              <strong className="text-gray-700">Hora:</strong>{' '}
              <span className="text-gray-900">
                {new Date().toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 relative">
      <button
        onClick={() => router.push('/registro')}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
      >
        Volver a Registro
      </button>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        {selectedParkingLot}
      </h1>
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => handleSpaceSelect(space.id)}
            disabled={space.status === 'Ocupado'}
            className={`p-6 border rounded-lg text-center font-bold ${
              selectedSpace === space.id
                ? 'bg-yellow-400 text-black'
                : space.status === 'Disponible'
                ? space.id === 1 || space.id === 2
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            } ${
              space.status === 'Ocupado'
                ? 'cursor-not-allowed'
                : 'hover:scale-105 transform transition-transform'
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
