'use client';

import { useState } from 'react';

interface UserDetails {
  name: string;
  role: string;
  plate: string;
  parking_lot: string;
  space: number;
  entry_time: string;
  exit_time: string;
}

export default function Salida() {
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

  const handleExit = async () => {
    if (!plate) {
      setMessage('Por favor, ingrese la placa del vehículo.');
      return;
    }

    try {
      // Liberar espacio y obtener detalles del usuario
      const response = await fetch('/api/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.details) {
          setUserDetails(data.details); // Guardar los detalles del servidor
          setMessage('Espacio liberado exitosamente.');
        } else {
          setMessage('Espacio liberado, pero no se encontraron detalles del registro.');
        }
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
      {userDetails && (
        <div className="mt-6 bg-white p-6 rounded shadow-md text-left">
          <h2 className="text-xl font-bold mb-4 text-green-600">Detalles del Registro</h2>
          <p><strong>Nombre:</strong> {userDetails.name}</p>
          <p><strong>Rol:</strong> {userDetails.role}</p>
          <p><strong>Placa:</strong> {userDetails.plate}</p>
          <p><strong>Parqueadero:</strong> {userDetails.parking_lot}</p>
          <p><strong>Espacio:</strong> {userDetails.space}</p>
          <p><strong>Hora de Entrada:</strong> {new Date(userDetails.entry_time).toLocaleString()}</p>
          <p><strong>Hora de Salida:</strong> {new Date(userDetails.exit_time).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
