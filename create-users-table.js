import { sql } from "./db.js";

sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL
);
`
  .then(() => console.log("Created users table"))
  .catch((err) => console.log(err))
  .finally(() => sql.end());
