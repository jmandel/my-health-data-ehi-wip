let sqliteResolve;
let sqlite = new Promise((resolve, reject) => {
  sqliteResolve = resolve;
});

const DB_URL = '/db.sqlite.dump';
const DB_HASH_KEY = 'dbHash';

let dbPromiseResolve;
let dbPromise = new Promise((resolve) => {
  dbPromiseResolve = resolve;
});

let db;

async function initializeDatabase() {
  console.log("Initializing database");
  let { oo1: sqloo } = await sqlite;

  const response = await fetch(DB_URL);
  const sqlDump = await response.text();
  const dbHash = await hashSqlDump(sqlDump);

  const storedHash = localStorage.getItem(DB_HASH_KEY);

  if (storedHash === dbHash) {
    console.log("Database hash unchanged, opening existing database");
    db = new sqloo.JsStorageDb('local');
  } else {
    console.log("Database hash changed, reloading database");
    db = new sqloo.JsStorageDb('local');
    db.clearStorage();
    await db.exec(sqlDump);
    localStorage.setItem(DB_HASH_KEY, dbHash);
  }

  dbPromiseResolve(true);
}

async function* query(sql, params = []) {
  await dbPromise;
  const stmt = db.prepare(sql);
  if (params.length > 0 || Object.keys(params).length > 0) {
    stmt.bind(params);
  }
  while (stmt.step()) {
    yield stmt.get({});
  }
  stmt.finalize();
}

window.query = query;
export { query };

import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

const start = function (sqlite3) {
  log('Running SQLite3 version', sqlite3.version.libVersion);
  console.log(sqlite3);
  sqliteResolve(sqlite3);
  initializeDatabase();
};

async function hashSqlDump(sqlDump) {
  const encoder = new TextEncoder();
  const data = encoder.encode(sqlDump);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite3) => {
  try {
    start(sqlite3);
  } catch (err) {
    error(err.name, err.message);
  }
});