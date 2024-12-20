import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const query = `SELECT * FROM history_entradas ORDER BY entry_time DESC;`;
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener history_entradas:', error);
    return NextResponse.json(
      { error: 'Error al obtener history_entradas' },
      { status: 500 }
    );
  }
}
