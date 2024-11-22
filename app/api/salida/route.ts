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

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Obtener el registro antes de eliminarlo
      const querySelect = `SELECT * FROM parking_entries WHERE plate = $1`;
      const resultSelect = await client.query(querySelect, [plate]);

      if (resultSelect.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Placa no encontrada' },
          { status: 404 }
        );
      }

      const record = resultSelect.rows[0];

      // Insertar en history_salidas
      const queryInsertHistory = `
        INSERT INTO history_salidas (name, role, plate, parking_lot, space, entry_time, exit_time)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `;
      await client.query(queryInsertHistory, [
        record.name,
        record.role,
        record.plate,
        record.parking_lot,
        record.space,
        record.entry_time,
      ]);

      // Eliminar de parking_entries
      const queryDelete = `DELETE FROM parking_entries WHERE plate = $1`;
      await client.query(queryDelete, [plate]);

      await client.query('COMMIT');

      return NextResponse.json(
        {
          message: 'Espacio liberado exitosamente.',
          details: {
            name: record.name,
            role: record.role,
            plate: record.plate,
            parking_lot: record.parking_lot,
            space: record.space,
            entry_time: record.entry_time,
            exit_time: new Date().toISOString(),
          },
        },
        { status: 200 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al procesar la salida:', error);
      return NextResponse.json(
        { error: 'Error al procesar la salida' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al conectar con la base de datos' },
      { status: 500 }
    );
  }
}
