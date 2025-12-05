import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import complaintRouter from "./routes/complaint.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server running ");
});

app.use("/api/auth", authRouter);
app.use("/api/complaint", complaintRouter);

await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
