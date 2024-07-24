import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_control_turnos",
});

export default pool;