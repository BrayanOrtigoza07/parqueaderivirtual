'use client';

import { useState } from 'react';

export default function Central() {
  const parkingLot = { name: 'Parqueadero Central', spaces: 16 };
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);

  const spaces = Array.from({ length: parkingLot.spaces }, (_, i) => ({
    id: i + 1,
    status: i % 3 === 0 ? 'Ocupado' : 'Disponible',
  }));

  const handleSpaceSelect = (id: number) => {
    setSelectedSpace(id);
  };

  const handleConfirm = () => {
    if (!selectedSpace) {
      alert('Por favor, selecciona un espacio.');
      return;
    }
    alert(`Has seleccionado el espacio ${selectedSpace} en ${parkingLot.name}.`);
  };

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
