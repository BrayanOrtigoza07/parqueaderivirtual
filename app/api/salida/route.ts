import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Manejo del método POST para liberar un espacio
export async function POST(req: Request) {
  try {
    const { plate } = await req.json();

    if (!plate) {
      return NextResponse.json(
        { error: 'La placa es requerida.' },
        { status: 400 }
      );
    }

    // Buscar el registro con la placa proporcionada
    const client = await pool.connect();
    const selectQuery = `
      SELECT * FROM parking_entries WHERE plate = $1 AND exit_time IS NULL;
    `;
    const selectResult = await client.query(selectQuery, [plate]);

    if (selectResult.rows.length === 0) {
      client.release();
      return NextResponse.json(
        { error: 'No se encontró un vehículo con esa placa actualmente estacionado.' },
        { status: 404 }
      );
    }

    const updateQuery = `
      UPDATE parking_entries
      SET exit_time = NOW()
      WHERE plate = $1 AND exit_time IS NULL;
    `;
    await client.query(updateQuery, [plate]);

    client.release();
    return NextResponse.json(
      { message: `Espacio liberado exitosamente para la placa: ${plate}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al liberar el espacio:', error);
    return NextResponse.json(
      { error: 'Error al liberar el espacio en la base de datos.' },
      { status: 500 }
    );
  }
}
