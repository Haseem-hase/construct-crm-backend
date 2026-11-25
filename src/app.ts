// Study: Sets up the shared steps requests go through, such as reading submitted information, before they reach a feature.
// Study: Bring in `express` from `"express"` so this file can use it.
import express from "express";
// Study: Bring in `cors` from `"cors"` so this file can use it.
import cors from "cors";
// Study: Bring in `helmet` from `"helmet"` so this file can use it.
import helmet from "helmet";
// Study: Bring in `compression` from `"compression"` so this file can use it.
import compression from "compression";
// Study: Bring in `cookieParser` from `"cookie-parser"` so this file can use it.
import cookieParser from "cookie-parser";
// Study: Bring in `path` from `"path"` so this file can use it.
import path from "path";
// Study: Bring in `routes` from `"./routes"` so this file can use it.
import routes from "./routes";
// Study: Bring in `{ errorHandler }` from `"./middlewares/error.middleware"` so this file can use it.
import { errorHandler } from "./middlewares/error.middleware";

// Study: Call `express` and store the result as `app`.
const app = express();

// Study: Register `cors({ origin: "http://localhost:3000" })` as a shared step for incoming requests.
app.use(cors({ origin: "http://localhost:3000" }));
// Study: Register `helmet()` as a shared step for incoming requests.
app.use(helmet());
// Study: Register `compression()` as a shared step for incoming requests.
app.use(compression());
// Study: Read information sent in JSON, the text format the screen uses to send named values.
app.use(express.json());
// Study: Register `cookieParser()` as a shared step for incoming requests.
app.use(cookieParser());
// Study: Register `"/uploads"` as a shared step for incoming requests.
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads"), {
    // Study: Set `fallthrough` to `false`.
    fallthrough: false,
    // Study: Set `immutable` to `true`.
    immutable: true,
    // Study: Set `maxAge` to `"1y"`.
    maxAge: "1y",
    // Study: Give `setHeaders` a step to run later when it needs a result.
    setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"),
// Study: End this group of values.
}));
// Study: Send requests whose addresses start with /api to the list of CRM features.
app.use("/api", routes);
// Study: Use the shared error handling step when a route reports a problem.
app.use(errorHandler);

// Study: Call `app.get`.
app.get("/", (_req, res) => {
    // Study: Send named information back to the screen as JSON.
    res.status(200).json({
        // Study: Tell the screen that the request succeeded.
        success: true,
        // Study: Set `message` to `"Construct CRM Backend is running 🚀"`.
        message: "Construct CRM Backend is running 🚀"
    // Study: End this group of values.
    });
// Study: End this group of steps.
});

// Study: Make `app` the main thing other files can get from this file.
export default app;
