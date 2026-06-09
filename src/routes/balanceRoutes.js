import { Router } from "express";
import { User } from "../models/User.js";
const router = Router();
router.post("/set-balance", async (req, res) => {
    try {
        const { initialBalance } = req.body;
        if (initialBalance === undefined || initialBalance === null) {
            const response = {
                success: false,
                message: "Initial balance is required",
            };
            res.status(400).json(response);
            return;
        }
        if (typeof initialBalance !== "number" || Number.isNaN(initialBalance)) {
            const response = {
                success: false,
                message: "Initial balance must be a number",
            };
            res.status(400).json(response);
            return;
        }
        if (initialBalance < 0) {
            const response = {
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
        const response = {
            success: true,
            message: "User balance was created successfully",
            data: user,
        };
        res.status(201).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Set balance error:", error.message);
        }
        else {
            console.error("Unknown set balance error:", error);
        }
        const response = {
            success: false,
            message: "Server error while setting balance",
        };
        res.status(500).json(response);
    }
});
export default router;
//# sourceMappingURL=balanceRoutes.js.map