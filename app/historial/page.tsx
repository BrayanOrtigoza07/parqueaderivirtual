'use client';

import { useState, useEffect } from 'react';

interface HistoryEntry {
  name: string;
  role: string;
  plate: string;
  parking_lot: string;
  space: number;
  entry_time: string;
  exit_time?: string;
}

export default function HistorialPage() {
  const [historyEntradas, setHistoryEntradas] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entradasResponse = await fetch('/api/history-entradas');
        if (entradasResponse.ok) {
          const entradasData: HistoryEntry[] = await entradasResponse.json();
          setHistoryEntradas(entradasData);
        } else {
          console.error('Error al cargar los datos');
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Cargando historial...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Historial de Parqueadero</h1>

      {/* Historial de Entradas */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Historial de Entradas</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Rol</th>
              <th className="border border-gray-300 px-4 py-2">Placa</th>
              <th className="border border-gray-300 px-4 py-2">Parqueadero</th>
              <th className="border border-gray-300 px-4 py-2">Espacio</th>
              <th className="border border-gray-300 px-4 py-2">Hora de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {historyEntradas.map((entry, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? 'bg-gray-50 text-gray-800' : 'bg-white text-gray-800'
                }
              >
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">{entry.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">{entry.role}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">{entry.plate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                  {entry.parking_lot}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">{entry.space}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                  {new Date(entry.entry_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
