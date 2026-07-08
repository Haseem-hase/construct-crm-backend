import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Construct CRM Backend is running 🚀"
    });
});

export default app;