import mysql from 'mysql';
let pool;

const createPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "db_control_turnos",
    });
  }
  return pool;
};

export default createPool;
