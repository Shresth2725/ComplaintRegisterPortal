import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server running ");
});

app.use("/api/auth", authRouter);

await connectDB();
app.listen(PORT, () => console.log("running"));
