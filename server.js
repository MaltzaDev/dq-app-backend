import express, { json } from "express";
import { DatabasePostgres } from "./database-postgres.js";
import { validateEmail } from "./validator.js";

const server = express();
server.use(express.json());

const database = new DatabasePostgres();

server.get("/login", async (request, response) => {
  const username = request.query.username;
  const password = request.query.password;

  if (!username || !password) {
    return response.status(401).send("Missing required fields");
  }

  const userNameExists = await database.checkUsername(username);
  if (!userNameExists) {
    return response.status(401).send("Username or password is incorrect");
  }

  const user = await database.checkUser(username, password);
  if (user) {
    return response
      .status(200)
      .setHeader("Content-Type", "application/json")
      .send({
        id: user.id,
        username: user.username,
        email: user.email,
      });
  }

  return response.status(401).send("Username or password is incorrect");
});

server.post("/signup", async (request, response) => {
  const { username, email, password } = request.body;

  if (!username || !email || !password) {
    return response.status(400).send("Missing required fields");
  }

  const userNameExists = await database.checkUsername(username);
  if (userNameExists) {
    return response.status(400).send("Username already exists");
  }

  if (!validateEmail(email)) {
    return response.status(400).send("Invalid email");
  }

  const emailExists = await database.checkEmail(email);
  if (emailExists) {
    return response.status(400).send("Email already exists");
  }

  await database
    .createUser({
      username,
      email,
      password,
    })
    .catch((err) => {
      console.log("Error creating user");
      return response.status(500).send("Internal server error");
    });

  return response.status(201).send("Sign up successful!");
});

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
