'use client';

import { useState } from 'react';

export default function Salida() {
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

  const handleLiberarEspacio = async () => {
    if (!plate) {
      setMessage('Por favor, ingrese la placa.');
      return;
    }

    try {
      const response = await fetch('/api/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Espacio liberado exitosamente para la placa: ${plate}.`);
        setPlate('');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al liberar el espacio:', error);
      setMessage('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Liberar Espacio</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <label className="block font-semibold mb-2">Placa del Vehículo</label>
        <input
          type="text"
          value={plate}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Ingrese la placa"
        />
        <button
          onClick={handleLiberarEspacio}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 w-full"
        >
          Liberar Espacio
        </button>
        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-blue-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
