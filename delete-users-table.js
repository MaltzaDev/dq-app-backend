import { sql } from "./db.js";

async function deleteUsersTable() {
  await sql`
        DROP TABLE IF EXISTS users;
    `;
}

deleteUsersTable()
  .then(() => console.log("Deleted users table"))
  .catch((err) => console.log(err))
  .finally(() => sql.end());
