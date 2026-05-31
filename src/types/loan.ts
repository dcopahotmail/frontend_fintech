export type LoanStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Completed";

export type LoanType = "Fixed" | "Decreasing";

export type PaymentStatus = "Pending" | "Paid";

export interface Loan {
  id: number;
  userId: string;
  amount: number;
  interestRate: number;
  term: number;
  loanType: LoanType;
  status: LoanStatus;
  monthlyPayment: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaymentScheduleItem {
  id: number;
  loanId: number;
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: PaymentStatus;
}

export interface LoanSimulationInput {
  amount: number;
  interestRate: number;
  term: number;
  loanType: 0 | 1;
}

export interface CreateLoanInput {
  userId: string;
  amount: number;
  term: number;
  interestRate: number;
  loanType: 0 | 1;
}

export interface LoanSimulationResult {
  amount: number;
  term: number;
  interestRate: number;
  loanType: LoanType;
  monthlyPayment: number;
  totalInterest: number;
  totalToPay: number;
  paymentSchedule: PaymentScheduleItem[];
}
