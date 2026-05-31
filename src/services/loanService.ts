import type {
  CreateLoanInput,
  Loan,
  LoanSimulationInput,
  LoanSimulationResult,
  PaymentScheduleItem,
} from "@/types/loan";
import { apiFetch } from "@/lib/api";

type LoanDto = {
  id: number;
  userId: string | null;
  amount: number;
  term: number;
  interestRate: number;
  loanType: number;
  status: number;
  monthlyPayment: number;
  createdAt: string;
  updatedAt: string | null;
};

type PaymentScheduleDto = {
  id: number;
  loanId: number;
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: number;
};

type LoanSimulationResultDto = {
  amount: number;
  term: number;
  interestRate: number;
  loanType: number;
  monthlyPayment: number;
  totalToPay: number;
  totalInterest: number;
  paymentSchedule: PaymentScheduleDto[] | null;
};

type CreateLoanDto = {
  userId: string;
  amount: number;
  term: number;
  interestRate: number;
  loanType: 0 | 1;
  monthlyPayment: number;
};

function mapLoanStatus(status: number): Loan["status"] {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Approved";
    case 2: return "Rejected";
    case 3: return "Active";
    case 4: return "Completed";
    default: return "Pending";
  }
}

function mapLoanType(loanType: number): Loan["loanType"] {
  switch (loanType) {
    case 0: return "Fixed";
    case 1: return "Decreasing";
    default: return "Fixed";
  }
}

function mapPaymentStatus(status: number): PaymentScheduleItem["status"] {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Paid";
    default: return "Pending";
  }
}

function mapLoan(dto: LoanDto): Loan {
  return {
    id: dto.id,
    userId: dto.userId ?? "Sin usuario",
    amount: dto.amount,
    term: dto.term,
    interestRate: dto.interestRate,
    loanType: mapLoanType(dto.loanType),
    status: mapLoanStatus(dto.status),
    monthlyPayment: dto.monthlyPayment,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

function mapScheduleItem(dto: PaymentScheduleDto): PaymentScheduleItem {
  return {
    id: dto.id,
    loanId: dto.loanId,
    paymentNumber: dto.paymentNumber,
    dueDate: dto.dueDate,
    totalPayment: dto.totalPayment,
    principal: dto.principal,
    interest: dto.interest,
    remainingBalance: dto.remainingBalance,
    status: mapPaymentStatus(dto.status),
  };
}

function mapSimulationResult(dto: LoanSimulationResultDto): LoanSimulationResult {
  return {
    amount: dto.amount,
    term: dto.term,
    interestRate: dto.interestRate,
    loanType: mapLoanType(dto.loanType),
    monthlyPayment: dto.monthlyPayment,
    totalToPay: dto.totalToPay,
    totalInterest: dto.totalInterest,
    paymentSchedule: (dto.paymentSchedule ?? []).map(mapScheduleItem),
  };
}

export async function getLoans(userId?: string): Promise<Loan[]> {
  const loans = await apiFetch<LoanDto[]>("loans", {
    query: {
      userId,
    },
  });

  return loans.map(mapLoan);
}

export async function getLoanById(id: number): Promise<Loan | undefined> {
  try {
    const loan = await apiFetch<LoanDto>(`loans/${id}`);
    return mapLoan(loan);
  } catch {
    return undefined;
  }
}

export async function getLoanSchedule(id: number): Promise<PaymentScheduleItem[]> {
  const schedule = await apiFetch<PaymentScheduleDto[]>(`loans/${id}/schedule`);
  return schedule.map(mapScheduleItem);
}

export async function simulateLoan(input: LoanSimulationInput): Promise<LoanSimulationResult> {
  const result = await apiFetch<LoanSimulationResultDto>("loans/simulate", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return mapSimulationResult(result);
}

function buildCreateLoanDto(input: CreateLoanInput): CreateLoanDto {
  return {
    userId: input.userId,
    amount: input.amount,
    term: input.term,
    interestRate: input.interestRate,
    loanType: input.loanType,
    monthlyPayment: input.monthlyPayment,
  };
}

export async function createLoan(input: CreateLoanInput): Promise<Loan> {
  const loan = await apiFetch<LoanDto>("loans", {
    method: "POST",
    body: JSON.stringify(buildCreateLoanDto(input)),
  });

  return mapLoan(loan);
}

export async function approveLoan(id: number): Promise<Loan> {
  const loan = await apiFetch<LoanDto>(`loans/${id}/approve`, {
    method: "PATCH",
  });

  return mapLoan(loan);
}

export async function rejectLoan(id: number): Promise<Loan> {
  const loan = await apiFetch<LoanDto>(`loans/${id}/reject`, {
    method: "PATCH",
  });

  return mapLoan(loan);
}