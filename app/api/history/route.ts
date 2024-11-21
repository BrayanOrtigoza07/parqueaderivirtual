import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Ruta para obtener el historial
export async function GET() {
  try {
    const query = `
      SELECT 
        id, name, role, plate, parking_lot, space, entry_time, exit_time
      FROM 
        parking_entries
      ORDER BY 
        entry_time DESC;
    `;

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    return NextResponse.json(
      { error: 'Error al obtener el historial' },
      { status: 500 }
    );
  }
}
