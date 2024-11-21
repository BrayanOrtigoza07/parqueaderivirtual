'use client';

import { useState } from 'react';

// Definir el tipo del registro que se espera
interface HistorySalida {
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
  const [lastRecord, setLastRecord] = useState<HistorySalida | null>(null);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value.toUpperCase()); // Convertir la placa a mayúsculas por consistencia
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
        // Esperar unos milisegundos antes de intentar recuperar el registro
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Solicitar detalles del registro desde `history_salidas`
        const fetchResponse = await fetch(`/api/history/salida?plate=${plate}`);
        const record = await fetchResponse.json();

        if (fetchResponse.ok && record.length > 0) {
          setLastRecord(record[0]); // Guardar el último registro obtenido
          setMessage(`Espacio liberado exitosamente para la placa: ${plate}.`);
        } else {
          setMessage(`Error: No se encontraron datos en el historial para la placa ${plate}.`);
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
      {lastRecord && (
        <div className="mt-6 bg-white p-6 rounded shadow-md text-left">
          <h2 className="text-xl font-bold mb-4">Detalles del Registro</h2>
          <p>
            <strong>Nombre:</strong> {lastRecord.name}
          </p>
          <p>
            <strong>Rol:</strong> {lastRecord.role}
          </p>
          <p>
            <strong>Placa:</strong> {lastRecord.plate}
          </p>
          <p>
            <strong>Parqueadero:</strong> {lastRecord.parking_lot}
          </p>
          <p>
            <strong>Espacio:</strong> {lastRecord.space}
          </p>
          <p>
            <strong>Hora de Entrada:</strong>{' '}
            {new Date(lastRecord.entry_time).toLocaleString()}
          </p>
          <p>
            <strong>Hora de Salida:</strong>{' '}
            {new Date(lastRecord.exit_time).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
