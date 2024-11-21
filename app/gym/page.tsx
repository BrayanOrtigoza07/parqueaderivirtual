'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ParkingPage() {
  return (
    <Suspense fallback={<div>Cargando página del parqueadero...</div>}>
      <ParkingContent />
    </Suspense>
  );
}

function ParkingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userData = {
    name: searchParams.get('name') || 'Usuario Anónimo',
    role: searchParams.get('role') || 'No especificado',
    plate: searchParams.get('plate') || 'Sin placa',
  };

  const parkingSpaces: Record<string, number> = {
    'Parqueadero Gym': 10,
    'Parqueadero Agronomía': 12,
    'Parqueadero Central': 16,
  };

  const selectedParkingLot = searchParams.get('parkingLot') || 'Parqueadero Gym';
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
            Array.from({ length: parkingSpaces[selectedParkingLot] || 0 }, (_, i) => ({
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
  }, [selectedParkingLot]);

  const handleSpaceSelect = (id: number) => {
    setSelectedSpace(id); // Actualizamos el espacio seleccionado
  };

  const handleConfirm = async () => {
    if (!selectedSpace || !selectedParkingLot) {
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
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-4xl font-bold text-green-600">¡Gracias por su ingreso!</h1>
          <img
            src="https://media1.tenor.com/m/atRVxzCTOVYAAAAC/neon-sign-neon.gif"
            alt="Neon Sign"
            className="w-20 h-20"
          />
        </div>
        <p className="text-lg text-gray-700 mb-8">Lo esperamos a la salida.</p>
        <div className="bg-white p-8 rounded shadow-md text-left w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Detalles del Registro</h2>
          <div className="text-lg space-y-2">
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Rol:</strong> {userData.role}</p>
            <p><strong>Placa:</strong> {userData.plate}</p>
            <p><strong>Parqueadero:</strong> {selectedParkingLot}</p>
            <p><strong>Espacio:</strong> {selectedSpace}</p>
            <p><strong>Hora:</strong> {new Date().toLocaleString()}</p>
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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{selectedParkingLot}</h1>
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => handleSpaceSelect(space.id)}
            disabled={space.status === 'Ocupado'}
            className={`p-6 border rounded-lg text-center font-bold ${
              selectedSpace === space.id
                ? 'bg-yellow-400 text-black' // Estilo especial para espacio seleccionado
                : space.status === 'Disponible'
                ? space.id === 1 || space.id === 2
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            } ${
              space.status === 'Ocupado' ? 'cursor-not-allowed' : 'hover:scale-105 transform transition-transform'
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
