'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Registro() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    plate: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleParkingLotSelect = (parkingLot: string) => {
    if (!formData.name || !formData.role || !formData.plate) {
      alert('Por favor, completa todos los campos antes de elegir un parqueadero.');
      return;
    }
    // Redirige a la página específica del parqueadero con los datos del formulario en la URL
    const query = new URLSearchParams({
      name: formData.name,
      role: formData.role,
      plate: formData.plate,
    }).toString();
    router.push(`/${parkingLot}?${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center px-4">
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
        Registro de Vehículo
      </h1>
      {/* Formulario */}
      <form className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Nombre del conductor</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su nombre"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Seleccionar --</option>
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Placa del vehículo</label>
          <input
            type="text"
            name="plate"
            value={formData.plate}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese la placa del vehículo"
            required
          />
        </div>
      </form>
      {/* Botones de parqueaderos */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Selecciona un parqueadero</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => handleParkingLotSelect('gym')}
            className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Parqueadero Gym
          </button>
          <button
            onClick={() => handleParkingLotSelect('agronomia')}
            className="px-6 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Parqueadero Agronomía
          </button>
          <button
            onClick={() => handleParkingLotSelect('central')}
            className="px-6 py-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
          >
            Parqueadero Central
          </button>
        </div>
      </div>
      {/* Botón para regresar */}
      <div className="mt-8">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
