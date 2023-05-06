import express from "express";
import { createConnection } from "typeorm";
import { UserController } from "./controllers/user.controller";
import dotenv from "dotenv";

dotenv.config();

createConnection({
    type: "postgres",
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT + ""),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: ["error"],
    entities: [
        "src/models/**/*.ts"
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    cli: {
        "entitiesDir": "src/models",
        "migrationsDir": "src/migration",
    }
}).then(() => {
    const app = express();

    app.use(express.json());

    app.use("/users", UserController);

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});
