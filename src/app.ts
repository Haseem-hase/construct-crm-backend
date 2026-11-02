import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads"), {
    fallthrough: false,
    immutable: true,
    maxAge: "1y",
    setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"),
}));
app.use("/api", routes);
app.use(errorHandler);

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Construct CRM Backend is running 🚀"
    });
});

export default app;
