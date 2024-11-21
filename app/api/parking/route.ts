import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Manejo del método POST para insertar datos (entradas) en la base de datos
export async function POST(req: Request) {
  try {
    const body = await req.json();

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
    console.error('Error al guardar los datos:', error);
    return NextResponse.json(
      { error: 'Error al guardar los datos en la base de datos' },
      { status: 500 }
    );
  }
}

// Manejo del método GET para recuperar el historial completo de entradas y salidas
export async function GET() {
  try {
    const query = `
      SELECT * FROM parking_entries ORDER BY entry_time DESC;
    `;

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos de la base de datos' },
      { status: 500 }
    );
  }
}

// Manejo del método PUT para actualizar los registros al liberar un espacio (salidas)
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const query = `
      UPDATE parking_entries
      SET exit_time = NOW()
      WHERE plate = $1 AND exit_time IS NULL
      RETURNING *;
    `;

    const values = [body.plate];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'No se encontró un registro activo para la placa proporcionada.' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al liberar el espacio:', error);
    return NextResponse.json(
      { error: 'Error al liberar el espacio en la base de datos' },
      { status: 500 }
    );
  }
}
