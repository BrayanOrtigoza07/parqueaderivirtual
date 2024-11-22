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
  const [historySalidas, setHistorySalidas] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({ mostUsedParking: '', mostFrequentRole: '' });

  // Cargar datos de ambas tablas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const entradasResponse = await fetch('/api/history-entradas');
        const salidasResponse = await fetch('/api/history-salidas');

        if (entradasResponse.ok && salidasResponse.ok) {
          const entradasData: HistoryEntry[] = await entradasResponse.json();
          const salidasData: HistoryEntry[] = await salidasResponse.json();

          setHistoryEntradas(entradasData);
          setHistorySalidas(salidasData);

          // Calcular estadísticas
          calculateStatistics(entradasData);
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

  const calculateStatistics = (entries: HistoryEntry[]) => {
    // Calcular el parqueadero más usado
    const parkingCount: Record<string, number> = {};
    const roleCount: Record<string, number> = {};

    entries.forEach((entry) => {
      parkingCount[entry.parking_lot] = (parkingCount[entry.parking_lot] || 0) + 1;
      roleCount[entry.role] = (roleCount[entry.role] || 0) + 1;
    });

    const mostUsedParking = Object.keys(parkingCount).reduce((a, b) =>
      parkingCount[a] > parkingCount[b] ? a : b
    );

    const mostFrequentRole = Object.keys(roleCount).reduce((a, b) =>
      roleCount[a] > roleCount[b] ? a : b
    );

    setStatistics({ mostUsedParking, mostFrequentRole });
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando historial...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Historial de Parqueadero</h1>

      {/* Estadísticas */}
      <div className="max-w-4xl mx-auto bg-blue-100 border border-blue-300 rounded p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Estadísticas</h2>
        <p className="text-lg font-medium">
          <strong>Parqueadero más usado:</strong> {statistics.mostUsedParking || 'Sin datos'}
        </p>
        <p className="text-lg font-medium">
          <strong>Rol más frecuente:</strong> {statistics.mostFrequentRole || 'Sin datos'}
        </p>
      </div>

      {/* Historial de Entradas */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Historial de Entradas</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
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
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="border border-gray-300 px-4 py-2">{entry.name}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.role}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.plate}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.parking_lot}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.space}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.entry_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Historial de Salidas */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Historial de Salidas</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
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
            {historySalidas.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="border border-gray-300 px-4 py-2">{entry.name}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.role}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.plate}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.parking_lot}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.space}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.entry_time}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.exit_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
