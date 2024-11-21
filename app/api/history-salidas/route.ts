import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Manejo del método GET para obtener registros de history_salidas
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plate = searchParams.get('plate'); // Obtener la placa de los parámetros de consulta, si existe

  try {
    let query = `SELECT * FROM history_salidas`;
    const values: string[] = [];

    if (plate) {
      query += ` WHERE plate = $1`;
      values.push(plate);
    }

    query += ` ORDER BY exit_time DESC;`;

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'No se encontraron registros.' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener history_salidas:', error);
    return NextResponse.json(
      { error: 'Error al obtener history_salidas' },
      { status: 500 }
    );
  }
}

// Manejo del método POST para insertar registros en history_salidas
export async function POST(req: Request) {
  try {
    const { name, role, plate, parkingLot, space, entryTime } = await req.json();

    const query = `
      INSERT INTO history_salidas (name, role, plate, parking_lot, space, entry_time, exit_time)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;

    const values = [name, role, plate, parkingLot, space, entryTime];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al insertar en history_salidas:', error);
    return NextResponse.json(
      { error: 'Error al insertar en history_salidas' },
      { status: 500 }
    );
  }
}
