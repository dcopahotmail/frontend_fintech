import type { CreateTransactionInput, Transaction } from "@/types/transaction";
import { apiFetch } from "@/lib/api";

type TransactionDto = {
  id: number;
  idempotencyKey: string | null;
  type: number;
  amount: number;
  status: number;
  loanId: number | null;
  description: string | null;
  createdAt: string;
};

function mapTransactionType(type: number): Transaction["type"] {
  switch (type) {
    case 0: return "Disbursement";
    case 1: return "Payment";
    case 2: return "Transfer";
    default: return "Disbursement";
  }
}

function mapTransactionStatus(status: number): Transaction["status"] {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Completed";
    case 2: return "Failed";
    default: return "Pending";
  }
}

function mapTransaction(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    idempotencyKey: dto.idempotencyKey,
    type: mapTransactionType(dto.type),
    amount: dto.amount,
    status: mapTransactionStatus(dto.status),
    loanId: dto.loanId,
    description: dto.description,
    createdAt: dto.createdAt,
  };
}

type GetTransactionsOptions = {
  loanId?: number;
  type?: 0 | 1 | 2;
  status?: 0 | 1 | 2;
};

export async function getTransactions(options: GetTransactionsOptions = {}): Promise<Transaction[]> {
  const { loanId, type, status } = options;
  const transactions = await apiFetch<TransactionDto[]>("transactions", {
    query: {
      loanId,
      type,
      status,
    },
  });

  return transactions.map(mapTransaction);
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const transaction = await apiFetch<TransactionDto>("transactions", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return mapTransaction(transaction);
}