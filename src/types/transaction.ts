export type TransactionStatus =
  | "Pending"
  | "Completed"
  | "Failed";

export type TransactionType =
  | "Disbursement"
  | "Payment"
  | "Transfer";

export interface Transaction {
  id: number;
  idempotencyKey: string | null;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  loanId: number | null;
  description: string | null;
  createdAt: string;
}

export interface CreateTransactionInput {
  idempotencyKey: string;
  type: 0 | 1 | 2;
  amount: number;
  loanId?: number | null;
  description?: string | null;
}