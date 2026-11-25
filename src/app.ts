// Study: Configure Express middleware, public uploads, and the API router.
// Study: Import `express` from `"express"`.
import express from "express";
// Study: Import `cors` from `"cors"`.
import cors from "cors";
// Study: Import `helmet` from `"helmet"`.
import helmet from "helmet";
// Study: Import `compression` from `"compression"`.
import compression from "compression";
// Study: Import `cookieParser` from `"cookie-parser"`.
import cookieParser from "cookie-parser";
// Study: Import `path` from `"path"`.
import path from "path";
// Study: Import `routes` from `"./routes"`.
import routes from "./routes";
// Study: Import `{ errorHandler }` from `"./middlewares/error.middleware"`.
import { errorHandler } from "./middlewares/error.middleware";

// Study: Call `express` and store the result as `app`.
const app = express();

// Study: Register `cors({ origin: "http://localhost:3000" })` in the Express middleware stack.
app.use(cors({ origin: "http://localhost:3000" }));
// Study: Register `helmet()` in the Express middleware stack.
app.use(helmet());
// Study: Register `compression()` in the Express middleware stack.
app.use(compression());
// Study: Register `express.json()` in the Express middleware stack.
app.use(express.json());
// Study: Register `cookieParser()` in the Express middleware stack.
app.use(cookieParser());
// Study: Register `"/uploads"` in the Express middleware stack.
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads"), {
    // Study: Set `fallthrough` to `false`.
    fallthrough: false,
    // Study: Set `immutable` to `true`.
    immutable: true,
    // Study: Set `maxAge` to `"1y"`.
    maxAge: "1y",
    // Study: Provide the callback used for `setHeaders`.
    setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"),
// Study: Close the object literal.
}));
// Study: Register `"/api"` in the Express middleware stack.
app.use("/api", routes);
// Study: Register `errorHandler` in the Express middleware stack.
app.use(errorHandler);

// Study: Call `app.get`.
app.get("/", (_req, res) => {
    // Study: Send a JSON response to the client.
    res.status(200).json({
        // Study: Set `success` to `true`.
        success: true,
        // Study: Set `message` to `"Construct CRM Backend is running 🚀"`.
        message: "Construct CRM Backend is running 🚀"
    // Study: Close the object literal.
    });
// Study: Close the code block.
});

// Study: Expose `app` as the default export.
export default app;
