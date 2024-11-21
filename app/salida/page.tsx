'use client';

import { useState } from 'react';

export default function Salida() {
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

  const handleExit = async () => {
    if (!plate) {
      setMessage('Por favor, ingrese la placa del vehículo.');
      return;
    }

    try {
      const response = await fetch('/api/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      });

      if (response.ok) {
        // Si la respuesta es exitosa, mostramos un mensaje
        setMessage(`Espacio liberado exitosamente para la placa: ${plate}.`);
        setPlate(''); // Limpiamos el campo de entrada
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
      <h1 className="text-3xl font-bold mb-6">Salida de Vehículo</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-2">Placa del vehículo</label>
          <input
            type="text"
            value={plate}
            onChange={handlePlateChange}
            className="w-full p-2 border rounded"
            placeholder="Ingrese la placa del vehículo"
            required
          />
        </div>
        <button
          onClick={handleExit}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Liberar Espacio
        </button>
      </div>
      {message && (
        <div className="mt-4 p-4 bg-gray-200 text-center rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
