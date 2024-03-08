import { sql } from "./db.js";

async function deleteAllUsers() {
  await sql`DELETE FROM users;`;
}

deleteAllUsers()
  .then(() => console.log("done"))
  .catch((err) => console.log(err))
  .finally(() => sql.end());
