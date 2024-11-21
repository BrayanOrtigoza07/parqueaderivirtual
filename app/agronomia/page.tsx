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

  // Obtener datos del usuario desde los parámetros de búsqueda
  const userData = {
    name: searchParams.get('name') || 'Usuario Anónimo',
    role: searchParams.get('role') || 'No especificado',
    plate: searchParams.get('plate') || 'Sin placa',
  };

  // Configuración específica del parqueadero Agronomía
  const selectedParkingLot = 'Parqueadero Agronomía';
  const totalSpaces = 12; // Total de espacios disponibles para este parqueadero

  const [spaces, setSpaces] = useState<{ id: number; status: string }[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Cargar espacios ocupados desde la base de datos
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
        setTimeout(() => {
          router.push('/');
        }, 3000);
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
        <h1 className="text-2xl font-bold text-green-600 mb-4">¡Gracias por su ingreso!</h1>
        <p className="mb-6">Lo esperamos a la salida.</p>
        <div className="bg-white p-6 rounded shadow-md text-left">
          <h2 className="text-xl font-bold mb-4">Detalles del Registro</h2>
          <p><strong>Nombre:</strong> {userData.name}</p>
          <p><strong>Rol:</strong> {userData.role}</p>
          <p><strong>Placa:</strong> {userData.plate}</p>
          <p><strong>Parqueadero:</strong> {selectedParkingLot}</p>
          <p><strong>Espacio:</strong> {selectedSpace}</p>
          <p><strong>Hora:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{selectedParkingLot}</h1>
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
