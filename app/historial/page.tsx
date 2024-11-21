'use client';

import { useState, useEffect } from 'react';

// Definimos un tipo para las entradas y salidas
type ParkingEntry = {
  id: number;
  name: string;
  role: string;
  plate: string;
  parking_lot: string;
  space: number;
  entry_time: string | null;
  exit_time: string | null;
};

export default function Historial() {
  const [entries, setEntries] = useState<ParkingEntry[]>([]);
  const [exits, setExits] = useState<ParkingEntry[]>([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        // Obtener todas las entradas
        const responseEntries = await fetch('/api/parking');
        const dataEntries: ParkingEntry[] = await responseEntries.json();

        // Filtrar las entradas que no tienen hora de salida
        setEntries(dataEntries.filter((entry) => !entry.exit_time));

        // Obtener todas las salidas
        const responseExits = await fetch('/api/salida');
        const dataExits: ParkingEntry[] = await responseExits.json();

        setExits(dataExits);
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Historial de Entradas y Salidas</h1>

      {/* Tabla de entradas */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md mb-10">
        <h2 className="text-xl font-bold text-center mb-4">Entradas</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Placa</th>
              <th className="border p-2">Parqueadero</th>
              <th className="border p-2">Espacio</th>
              <th className="border p-2">Hora de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="odd:bg-gray-100">
                <td className="border p-2">{entry.name}</td>
                <td className="border p-2">{entry.role}</td>
                <td className="border p-2">{entry.plate}</td>
                <td className="border p-2">{entry.parking_lot}</td>
                <td className="border p-2 text-center">{entry.space}</td>
                <td className="border p-2">
                  {entry.entry_time ? new Date(entry.entry_time).toLocaleString() : 'Sin hora de entrada'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de salidas */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Salidas</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Placa</th>
              <th className="border p-2">Parqueadero</th>
              <th className="border p-2">Espacio</th>
              <th className="border p-2">Hora de Entrada</th>
              <th className="border p-2">Hora de Salida</th>
            </tr>
          </thead>
          <tbody>
            {exits.map((exit) => (
              <tr key={exit.id} className="odd:bg-gray-100">
                <td className="border p-2">{exit.name}</td>
                <td className="border p-2">{exit.role}</td>
                <td className="border p-2">{exit.plate}</td>
                <td className="border p-2">{exit.parking_lot}</td>
                <td className="border p-2 text-center">{exit.space}</td>
                <td className="border p-2">
                  {exit.entry_time ? new Date(exit.entry_time).toLocaleString() : 'Sin hora de entrada'}
                </td>
                <td className="border p-2">
                  {exit.exit_time ? new Date(exit.exit_time).toLocaleString() : 'Sin hora de salida'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
