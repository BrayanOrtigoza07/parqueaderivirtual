'use client';

import { useState } from 'react';

export default function Salida() {
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');
  const [lastRecord, setLastRecord] = useState<any | null>(null);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
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
        // Solicitar detalles del registro desde `history_salidas`
        const fetchResponse = await fetch(`/api/history/salida?plate=${plate}`);
        const record = await fetchResponse.json();

        if (fetchResponse.ok) {
          setLastRecord(record[0]); // Guardar el último registro obtenido
          setMessage(`Espacio liberado exitosamente para la placa: ${plate}.`);
        } else {
          setMessage(`Error al obtener el historial: ${record.error}`);
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
          <p><strong>Nombre:</strong> {lastRecord?.name || 'N/A'}</p>
          <p><strong>Rol:</strong> {lastRecord?.role || 'N/A'}</p>
          <p><strong>Placa:</strong> {lastRecord?.plate || 'N/A'}</p>
          <p><strong>Parqueadero:</strong> {lastRecord?.parking_lot || 'N/A'}</p>
          <p><strong>Espacio:</strong> {lastRecord?.space || 'N/A'}</p>
          <p>
            <strong>Hora de Entrada:</strong>{' '}
            {lastRecord?.entry_time ? new Date(lastRecord.entry_time).toLocaleString() : 'N/A'}
          </p>
          <p>
            <strong>Hora de Salida:</strong>{' '}
            {lastRecord?.exit_time ? new Date(lastRecord.exit_time).toLocaleString() : 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
}
