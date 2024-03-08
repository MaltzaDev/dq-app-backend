import { sql } from "./db.js";
import bcrypt from "bcrypt";

const rounds = 10;

export class DatabasePostgres {
  async list() {
    return sql`select * from users;`;
  }

  async createUser(user) {
    const { username, email, password } = user;

    const lowerUsername = username.toLowerCase();
    const lowerEmail = email.toLowerCase();

    const passwordHash = await bcrypt.hash(password, rounds).catch((err) => {
      console.log(err);
    });

    await sql`insert into users (username, email, passwordHash) VALUES (${lowerUsername}, ${lowerEmail}, ${passwordHash})`;
  }

  async checkUsername(username) {
    const lowerUsername = username.toLowerCase();
    const user =
      await sql`select * from users where username = ${lowerUsername};`;

    return user !== undefined && user.length > 0;
  }

  async checkEmail(email) {
    const lowerEmail = email.toLowerCase();
    const user = await sql`select * from users where email = ${lowerEmail};`;

    return user !== undefined && user.length > 0;
  }

  async checkUser(username, password) {
    const lowerUsername = username.toLowerCase();

    const user =
      await sql`select * from users where username = ${lowerUsername};`;

    if (user === undefined || user.length === 0) {
      return false;
    }

    const match = await bcrypt.compare(password, user[0].passwordhash);

    if (match) {
      return user[0];
    }

    return null;
  }
}
