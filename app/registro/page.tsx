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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Registro de vehículo</h1>
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nombre del conductor</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Seleccionar --</option>
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Placa del vehículo</label>
          <input
            type="text"
            name="plate"
            value={formData.plate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </form>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Selecciona un parqueadero</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleParkingLotSelect('gym')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Parqueadero Gym
          </button>
          <button
            onClick={() => handleParkingLotSelect('agronomia')}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
          >
            Parqueadero Agronomía
          </button>
          <button
            onClick={() => handleParkingLotSelect('central')}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
          >
            Parqueadero Central
          </button>
        </div>
      </div>
    </div>
  );
}
