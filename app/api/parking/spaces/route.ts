import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parkingLot = url.searchParams.get('parkingLot');

  if (!parkingLot) {
    return NextResponse.json(
      { error: 'Se requiere el nombre del parqueadero' },
      { status: 400 }
    );
  }

  try {
    const query = `SELECT id, status FROM parking_spaces WHERE parking_lot = $1`;
    const values = [parkingLot];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    return NextResponse.json({ spaces: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error al cargar los espacios:', error);
    return NextResponse.json({ error: 'Error al cargar los espacios' }, { status: 500 });
  }
}
