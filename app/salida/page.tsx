'use client';

import { useState } from 'react';

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
  const [latestRecord, setLatestRecord] = useState<HistorySalida | null>(null);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

  const handleExit = async () => {
    if (!plate) {
      setMessage('Por favor, ingrese la placa del vehículo.');
      return;
    }

    try {
      // Llamada a la API para liberar el espacio
      const response = await fetch('/api/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      });

      if (response.ok) {
        setMessage(`Espacio liberado exitosamente para la placa: ${plate}.`);
        // Obtener el último registro de la tabla `history_salidas`
        const latestData = await fetchLatestSalida(plate);
        setLatestRecord(latestData);
        setPlate(''); // Limpiar el campo de entrada
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
        setLatestRecord(null);
      }
    } catch (error) {
      console.error('Error al liberar el espacio:', error);
      setMessage('Error al conectar con el servidor.');
      setLatestRecord(null);
    }
  };

  const fetchLatestSalida = async (plate: string): Promise<HistorySalida | null> => {
    try {
      const response = await fetch(`/api/history-salidas?plate=${plate}`);
      if (response.ok) {
        const data: HistorySalida = await response.json();
        return data;
      } else {
        console.error('Error al obtener los datos:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Salida de Vehículo</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto mb-8">
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
        {message && (
          <div className="mt-4 p-4 bg-gray-200 text-center rounded">
            <p>{message}</p>
          </div>
        )}
      </div>

      {/* Mostrar el último registro agregado a la tabla `history_salidas` */}
      {latestRecord && (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Último Registro en Historial de Salidas</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Rol</th>
                <th className="border border-gray-300 px-4 py-2">Placa</th>
                <th className="border border-gray-300 px-4 py-2">Parqueadero</th>
                <th className="border border-gray-300 px-4 py-2">Espacio</th>
                <th className="border border-gray-300 px-4 py-2">Hora de Entrada</th>
                <th className="border border-gray-300 px-4 py-2">Hora de Salida</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.name}</td>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.role}</td>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.plate}</td>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.parking_lot}</td>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.space}</td>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.entry_time}</td>
                <td className="border border-gray-300 px-4 py-2">{latestRecord.exit_time}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
