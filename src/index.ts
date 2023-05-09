import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ConnectionOptions, createConnection } from "typeorm";
import dotenv from "dotenv";
import { AuthController } from "./controllers/auth.controller";
import { BookController } from "./controllers/book.controller";
import { UserController } from "./controllers/user.controller";
import { join } from 'path';

dotenv.config();

const TYPEORM_CONFIG: ConnectionOptions = {
    type: "mssql",
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT + ""),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: ["error"],
    entities: [join(__dirname, '**', '*.model.{ts,js}')]
};

console.debug(TYPEORM_CONFIG);

createConnection(TYPEORM_CONFIG).then(() => {
    const app = express();

    // Agregar middleware Helmet
    app.use(helmet());

    // Agregar middleware CORS
    app.use(cors({
        origin: '*'
    }));

    // Agregar middleware de body-parser
    app.use(express.json());

    app.use("/auth", AuthController);
    app.use("/user", UserController);
    app.use("/book", BookController);

    app.listen(3000, "0.0.0.0", () => {
        console.log("Server running on port 3000");
    });
});
