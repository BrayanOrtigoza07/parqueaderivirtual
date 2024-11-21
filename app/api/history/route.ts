import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Ruta para obtener el historial separado
export async function GET() {
  try {
    const client = await pool.connect();

    // Entradas (aún no salieron)
    const entriesQuery = `
      SELECT id, name, role, plate, parking_lot, space, entry_time
      FROM parking_entries
      WHERE exit_time IS NULL
      ORDER BY entry_time DESC;
    `;
    const entriesResult = await client.query(entriesQuery);

    // Salidas (ya salieron)
    const exitsQuery = `
      SELECT id, name, role, plate, parking_lot, space, entry_time, exit_time
      FROM parking_entries
      WHERE exit_time IS NOT NULL
      ORDER BY exit_time DESC;
    `;
    const exitsResult = await client.query(exitsQuery);

    client.release();

    return NextResponse.json(
      {
        entries: entriesResult.rows,
        exits: exitsResult.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    return NextResponse.json(
      { error: 'Error al obtener el historial' },
      { status: 500 }
    );
  }
}
