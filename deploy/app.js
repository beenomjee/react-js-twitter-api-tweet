import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { tweetRouter } from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config({});
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.use(express.static("public"));

// routes
app.use("/api/v1/tweet", tweetRouter);

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

export default app;
