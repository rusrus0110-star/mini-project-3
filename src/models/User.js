import mongoose, { Document, Model, Schema } from "mongoose";
const transactionSchema = new Schema({
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Transaction amount cannot be negative"],
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: true,
});
const userSchema = new Schema({
    initialBalance: {
        type: Number,
        required: [true, "Initial balance is required"],
        min: [0, "Initial balance cannot be negative"],
    },
    currentBalance: {
        type: Number,
        required: [true, "Current balance is required"],
        min: [0, "Current balance cannot be negative"],
    },
    transactions: {
        type: [transactionSchema],
        default: [],
    },
}, {
    timestamps: true,
});
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map