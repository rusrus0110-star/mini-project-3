import mongoose, { Document, Model, Schema } from "mongoose";

export type TransactionType = "income" | "expense";

export interface ITransaction {
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: Date;
}

export interface IUser extends Document {
  initialBalance: number;
  currentBalance: number;
  transactions: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
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
  },
  {
    _id: true,
  },
);

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  },
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
