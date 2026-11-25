// Study: Load environment variables and expose the backend configuration.
// Study: Import `dotenv` from `"dotenv"`.
import dotenv from "dotenv";

// Study: Call `dotenv.config`.
dotenv.config();

// Study: Build the object `env` with the entries below.
export const env = {
    // Study: Set `PORT` to `Number(process.env.PORT) || 5001`.
    PORT: Number(process.env.PORT) || 5001,

    // Study: Set `DATABASE_URL` to `process.env.DATABASE_URL!`.
    DATABASE_URL: process.env.DATABASE_URL!,

    // Study: Set `JWT_SECRET` to `process.env.JWT_SECRET!`.
    JWT_SECRET: process.env.JWT_SECRET!,
    // Study: Set `JWT_REFRESH_SECRET` to `process.env.JWT_REFRESH_SECRET!`.
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

    // Study: Set `SUPER_ADMIN_EMAIL` to `process.env.SUPER_ADMIN_EMAIL!`.
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
    // Study: Set `SUPER_ADMIN_PASSWORD` to `process.env.SUPER_ADMIN_PASSWORD!`.
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,

// Study: Close the object literal.
};