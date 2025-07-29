const sqlite3 = require('sqlite3');

let sqlDb;

const usersTable = {
  username: "username",
  pw: "password",
};
Object.freeze(usersTable);


const freetsTable = {
  freetID: "freetID",
  author: "freetAuthor",
  freetContent: "freetContent",
  upvotes: "upvotes"
};
Object.freeze(freetsTable);

const relationsTable = {
  relationType: "relationType",
  currUser: "currentUser",
  currFreet: "currentFreetID",
  ogUser: "ogUser",
  ogFreet: "ogFreetID"
};
Object.freeze(relationsTable);


function createDb() {
  console.log("Created our database!");
  sqlDb = new sqlite3.Database('fritter.db', function() {
    createUserTable();
    createFreetTable();
    createRelationTable();
  });
};

function createUserTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS users (
    ${usersTable.username} TEXT PRIMARY KEY NOT NULL UNIQUE,
    ${usersTable.pw} TEXT  )`);
}


function createFreetTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS freets (
    ${freetsTable.freetID} TEXT,
    ${freetsTable.author} TEXT,
    ${freetsTable.freetContent} TEXT,
    ${freetsTable.upvotes} INT)`);
}

function createRelationTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS relations (
    ${relationsTable.relationType} INTEGER,
    ${relationsTable.currUser} TEXT,
    ${relationsTable.currFreet} INTEGER,
    ${relationsTable.ogUser} TEXT,
    ${relationsTable.ogFreet} INTEGER
  )`);
}

// Helper wrapper functions that return promises, resolves when SQL queries are complete
function run(sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    sqlDb.run(sqlQuery, params, function(err) {
      if (err !== null) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    })
  });
};

function get(sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    sqlDb.get(sqlQuery, params, (err, row) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
};

function all(sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    sqlDb.all(sqlQuery, params, (err, rows) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

createDb();

module.exports = {
  usersTable,
  freetsTable,
  relationsTable,
  get,
  all,
  run
}
