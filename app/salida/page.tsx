'use client';

import { useState } from 'react';

export default function Salida() {
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value.toUpperCase()); // Convertir la placa a mayúsculas
  };

  const handleExit = async () => {
    if (!plate) {
      setMessage('Por favor, ingrese la placa del vehículo.');
      return;
    }

    try {
      // Enviar solicitud para liberar espacio
      const response = await fetch('/api/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito con la placa
        setMessage(`Salida registrada para la placa ${plate}. ¡Regresa pronto!`);
        setPlate(''); // Limpiar el campo de entrada
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Salida de Vehículo
        </h1>
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            Placa del vehículo
          </label>
          <input
            type="text"
            value={plate}
            onChange={handlePlateChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese la placa del vehículo"
            maxLength={10}
            required
          />
        </div>
        <button
          onClick={handleExit}
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Liberar Espacio
        </button>
        {message && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 text-center rounded-lg">
            <p className="font-semibold">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
