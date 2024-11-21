'use client';

import { useEffect, useState } from 'react';

export default function HistorialPage() {
  const [history, setHistory] = useState<
    {
      id: number;
      name: string;
      role: string;
      plate: string;
      parking_lot: string;
      space: number;
      entry_time: string;
      exit_time: string | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          console.error('Error al cargar el historial:', await response.text());
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando historial...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Historial de Entradas y Salidas</h1>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
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
            {history.map((entry) => (
              <tr key={entry.id} className="odd:bg-gray-100">
                <td className="border p-2">{entry.name}</td>
                <td className="border p-2">{entry.role}</td>
                <td className="border p-2">{entry.plate}</td>
                <td className="border p-2">{entry.parking_lot}</td>
                <td className="border p-2 text-center">{entry.space}</td>
                <td className="border p-2">{new Date(entry.entry_time).toLocaleString()}</td>
                <td className="border p-2">
                  {entry.exit_time ? new Date(entry.exit_time).toLocaleString() : '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
