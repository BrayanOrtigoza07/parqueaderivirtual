'use client';

import { useState, useEffect } from 'react';

export default function HistorialPage() {
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch('/api/parking');
        if (response.ok) {
          const data = await response.json();
          const entradas = data.filter((item: any) => !item.exit_time); // Registros sin hora de salida
          const salidas = data.filter((item: any) => item.exit_time);  // Registros con hora de salida
          setEntries(entradas);
          setExits(salidas);
        } else {
          setError('Error al cargar el historial');
          console.error(await response.text());
        }
      } catch (error) {
        setError('Error al conectar con la API');
        console.error(error);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Historial de Entradas y Salidas</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md mb-10">
        <h2 className="text-xl font-bold mb-4">Entradas</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
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
            {entries.map((entry: any) => (
              <tr key={entry.id} className="odd:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{entry.name}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.role}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.plate}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.parking_lot}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{entry.space}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(entry.entry_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Salidas</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
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
            {exits.map((exit: any) => (
              <tr key={exit.id} className="odd:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{exit.name}</td>
                <td className="border border-gray-300 px-4 py-2">{exit.role}</td>
                <td className="border border-gray-300 px-4 py-2">{exit.plate}</td>
                <td className="border border-gray-300 px-4 py-2">{exit.parking_lot}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{exit.space}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(exit.entry_time).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(exit.exit_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
