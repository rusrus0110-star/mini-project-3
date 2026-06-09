import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import balanceRoutes from "./routes/balanceRoutes.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Mini Project 3 API is running",
  });
});

app.use("/api", balanceRoutes);

app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Server start error:", error.message);
    } else {
      console.error("Unknown server start error:", error);
    }

    process.exit(1);
  }
};

startServer();
