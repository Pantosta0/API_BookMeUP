import express from "express";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import { AuthController } from "./controllers/auth.controller";

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

    app.use("/auth", AuthController);

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});
