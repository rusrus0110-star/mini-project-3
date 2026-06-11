import { Router } from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";

interface SetBalanceRequestBody {
  initialBalance?: unknown;
}

interface AddBalanceRequestBody {
  userId?: unknown;
  amount?: unknown;
  description?: unknown;
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

router.post(
  "/add-balance",
  async (
    req: Request<Record<string, never>, unknown, AddBalanceRequestBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId, amount, description } = req.body;

      if (userId === undefined || userId === null) {
        const response: ErrorResponse = {
          success: false,
          message: "User ID is required",
        };

        res.status(400).json(response);
        return;
      }

      if (typeof userId !== "string" || userId.trim() === "") {
        const response: ErrorResponse = {
          success: false,
          message: "User ID must be a non-empty string",
        };

        res.status(400).json(response);
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        const response: ErrorResponse = {
          success: false,
          message: "Invalid user ID format",
        };

        res.status(400).json(response);
        return;
      }

      if (amount === undefined || amount === null) {
        const response: ErrorResponse = {
          success: false,
          message: "Amount is required",
        };

        res.status(400).json(response);
        return;
      }

      if (typeof amount !== "number" || Number.isNaN(amount)) {
        const response: ErrorResponse = {
          success: false,
          message: "Amount must be a number",
        };

        res.status(400).json(response);
        return;
      }

      if (amount <= 0) {
        const response: ErrorResponse = {
          success: false,
          message: "Amount must be greater than zero",
        };

        res.status(400).json(response);
        return;
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
      ) {
        const response: ErrorResponse = {
          success: false,
          message: "Description must be a string",
        };

        res.status(400).json(response);
        return;
      }

      const user = await User.findById(userId);

      if (!user) {
        const response: ErrorResponse = {
          success: false,
          message: "User was not found",
        };

        res.status(404).json(response);
        return;
      }

      user.currentBalance += amount;

      user.transactions.push({
        type: "income",
        amount,
        description:
          typeof description === "string" && description.trim() !== ""
            ? description.trim()
            : "Balance top-up",
        createdAt: new Date(),
      });

      await user.save();

      const response: SuccessResponse<typeof user> = {
        success: true,
        message: "Balance was added successfully",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Add balance error:", error.message);
      } else {
        console.error("Unknown add balance error:", error);
      }

      const response: ErrorResponse = {
        success: false,
        message: "Server error while adding balance",
      };

      res.status(500).json(response);
    }
  },
);

export default router;
