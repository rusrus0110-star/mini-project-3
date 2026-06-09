import { Document, Model } from "mongoose";
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
export declare const User: Model<IUser>;
//# sourceMappingURL=User.d.ts.map