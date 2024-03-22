import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const { isTEST } = process.env

async function openDb () {
  sqlite3.verbose();
  const db = await open({
    filename: isTEST ? 'database/db_test.sqlite3' : 'database/projeto_final.sqlite3',
    driver: sqlite3.Database,
  });

  return db;
}


export async function insertUser(data) {
  const { db } = await openDb();
  try {    
    const { name, age, email, phone, vehicle } = data;
    const insertQuery = `INSERT OR IGNORE INTO users (name, age, email, phone, vehicle) VALUES (?, ?, ?, ?, ?)`;
    db.run(
      insertQuery,
      [`${name}`, age, `${email}`, `${phone}`, `${vehicle}`],
      function (error) {
        if(error) {
          console.error("SLQLite Insert Error Exec: ", error);
        } else {
          console.log(`Inserted data with id ${this.lastID}`);
        }
      }
    );
  } catch (error) {
    console.error("SLQLite Insert Error: ", error);
  } finally {
    db.close();
  }
}


export async function initializeDb() {
  const { db } = await openDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      "id" INTEGER PRIMARY KEY,
      "name" TEXT,
      "age" INTEGER,
      "email" TEXT,
      "phone" TEXT,
      "vehicle" TEXT
    )
  `);

  if(isTEST) {
    const user = {
      "name": "Peter Parker",
      "age": 20,
      "email": "spider-man@gmail.com",
      "phone": "(55) 9999-1111",
      "vehicle": "Motoneta"
    }

    const secondUser = {
      "name": "Bruce Wayne",
      "age": 30,
      "email": "batman-man@gmail.com",
      "phone": "(55) 9989-1111",
      "vehicle": "Batmovel"
    }

    await insertUser(user)
    await insertUser(secondUser)
  }
}

export async function updateUser(userId, data) {
  const { db } = await openDb();
  try {    
    const { name, age, email, phone, vehicle } = data;
    const updateQuery = `
      UPDATE users 
      SET name = "${name}", age = ${age}, email = "${email}", phone = "${phone}", vehicle = "${vehicle}"
      WHERE id = ${userId}  
    `;

    db.run(
      updateQuery,
      function (error) {
        if(error) {
          console.error("SLQLite Insert Error Exec: ", error);
        } else {
          console.log(`Updated data with id ${userId}`);
        }
      }
    );
  } catch (error) {
    console.error("SLQLite Insert Error: ", error);
  } finally {
    db.close();
  }
}

export async function deleteUser(userId) {
  const { db } = await openDb();
  try {    
    const deleteQuery = `
      DELETE FROM users WHERE id=${userId}
    `;
    db.run(
      deleteQuery,
      function (error) {
        if(error) {
          console.error("SLQLite Delete Error Exec: ", error);
        }
      }
    );
  } catch (error) {
    console.error("SLQLite Delete Error: ", error);
  } finally {
    db.close();
  }
}

export async function getUsers(limit, skip, search, userId = undefined) {
  const { db } = await openDb();
  try {
    let sqlQuery = "SELECT * FROM users";

    if(search && !userId) {
      sqlQuery += ` WHERE name LIKE '%${search.toLowerCase()}%'`;
    }

    if(userId) {
      sqlQuery += ` WHERE id = ${userId}`;
    }
  
    if(limit) {
      sqlQuery += ` LIMIT ${limit}`;
    }

    if(skip) {
      sqlQuery += ` OFFSET ${skip}`;
    }

    const result = await new Promise(function (resolve, reject) {
      db.all(sqlQuery,  (error, row) => {
        if(error) {
          console.error("SLQLite Get Error Exec: ", error);
          reject(error);
        }

        resolve(row);
      })
    });

    return result;
  } catch (error) {
    console.error("SLQLite Get Error: ", error);
    return;
  } finally {
    db.close();
  }
}