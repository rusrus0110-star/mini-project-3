import { Router } from "express";
import type { Request, Response } from "express";
import { User } from "../models/User.js";

interface SetBalanceRequestBody {
  initialBalance?: unknown;
}

interface ErrorResponse {
  success: false;
  message: string;
}

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

const router = Router();

router.post(
  "/set-balance",
  async (
    req: Request<Record<string, never>, unknown, SetBalanceRequestBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { initialBalance } = req.body;

      if (initialBalance === undefined || initialBalance === null) {
        const response: ErrorResponse = {
          success: false,
          message: "Initial balance is required",
        };

        res.status(400).json(response);
        return;
      }

      if (typeof initialBalance !== "number" || Number.isNaN(initialBalance)) {
        const response: ErrorResponse = {
          success: false,
          message: "Initial balance must be a number",
        };

        res.status(400).json(response);
        return;
      }

      if (initialBalance < 0) {
        const response: ErrorResponse = {
          success: false,
          message: "Initial balance cannot be negative",
        };

        res.status(400).json(response);
        return;
      }

      const user = await User.create({
        initialBalance,
        currentBalance: initialBalance,
        transactions: [],
      });

      const response: SuccessResponse<typeof user> = {
        success: true,
        message: "User balance was created successfully",
        data: user,
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Set balance error:", error.message);
      } else {
        console.error("Unknown set balance error:", error);
      }

      const response: ErrorResponse = {
        success: false,
        message: "Server error while setting balance",
      };

      res.status(500).json(response);
    }
  },
);

export default router;
