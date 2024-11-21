import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificar que todos los datos necesarios estén presentes
    if (!body.name || !body.role || !body.plate || !body.parkingLot || !body.space) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios' },
        { status: 400 }
      );
    }

    // Consulta SQL para insertar los datos
    const query = `
      INSERT INTO parking_entries (name, role, plate, parking_lot, space, entry_time)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;

    const values = [
      body.name,
      body.role,
      body.plate,
      body.parkingLot,
      body.space,
    ];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al guardar los datos en la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al guardar los datos en la base de datos' },
      { status: 500 }
    );
  }
}
