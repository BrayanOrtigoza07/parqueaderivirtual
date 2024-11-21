import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  try {
    const { plate } = await req.json();

    if (!plate) {
      return NextResponse.json(
        { error: 'Placa no proporcionada' },
        { status: 400 }
      );
    }

    // Actualizar el espacio a "Disponible" en la base de datos
    const query = `
      DELETE FROM parking_entries
      WHERE plate = $1
      RETURNING *;
    `;
    const values = [plate];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Placa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Espacio liberado para la placa: ${plate}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al liberar el espacio:', error);
    return NextResponse.json(
      { error: 'Error al liberar el espacio en la base de datos' },
      { status: 500 }
    );
  }
}
