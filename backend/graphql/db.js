// db.js — Pool de conexiones MySQL con mysql2/promise
// Compatible con XAMPP / phpMyAdmin (MySQL 8 / MariaDB)

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || '127.0.0.1',
  port:               parseInt(process.env.DB_PORT || '3306', 10),
  database:           process.env.DB_NAME     || 'app_db',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  charset:            'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  // Seguridad: deshabilitar LOCAL INFILE para prevenir ataques de lectura de archivos
  multipleStatements: false,
});

// Validar conexión al arrancar
pool.getConnection()
  .then(conn => {
    console.log('✅  Conexión a MySQL establecida correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('❌  No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  });

export default pool;
