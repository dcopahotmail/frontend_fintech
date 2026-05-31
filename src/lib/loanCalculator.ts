import type { PaymentScheduleItem } from "@/types/loan";

type RepaymentType = "FIXED" | "DECREASING";

type BuildScheduleInput = {
  amount: number;
  tea: number;
  term: number;
  repaymentType: RepaymentType;
  startDate: string;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function addMonthKeepingDay(baseDate: Date, monthOffset: number, preferredDay: number): Date {
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth() + monthOffset;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const day = Math.min(preferredDay, daysInMonth(targetYear, targetMonth));

  return new Date(Date.UTC(targetYear, targetMonth, day));
}

export function calculateTem(tea: number): number {
  return Math.pow(1 + tea / 100, 1 / 12) - 1;
}

function buildFixedSchedule(input: BuildScheduleInput, tem: number): PaymentScheduleItem[] {
  const pow = Math.pow(1 + tem, input.term);
  const fixedPayment = tem === 0 ? input.amount / input.term : (input.amount * (tem * pow)) / (pow - 1);
  let balance = input.amount;
  const start = new Date(input.startDate);
  const preferredDay = start.getUTCDate();

  return Array.from({ length: input.term }, (_, index) => {
    const interest = round2(balance * tem);
    const principal = index === input.term - 1 ? round2(balance) : round2(fixedPayment - interest);
    balance = round2(Math.max(0, balance - principal));

    return {
      id: 0,
      loanId: 0,
      paymentNumber: index + 1,
      dueDate: addMonthKeepingDay(start, index + 1, preferredDay).toISOString(),
      totalPayment: round2(principal + interest),
      principal,
      interest,
      remainingBalance: balance,
      status: "Pending",
    };
  });
}

function buildDecreasingSchedule(input: BuildScheduleInput, tem: number): PaymentScheduleItem[] {
  const amortization = round2(input.amount / input.term);
  let balance = input.amount;
  const start = new Date(input.startDate);
  const preferredDay = start.getUTCDate();

  return Array.from({ length: input.term }, (_, index) => {
    const interest = round2(balance * tem);
    const principal = index === input.term - 1 ? round2(balance) : amortization;
    const payment = round2(principal + interest);
    balance = round2(Math.max(0, balance - principal));

    return {
      id: 0,
      loanId: 0,
      paymentNumber: index + 1,
      dueDate: addMonthKeepingDay(start, index + 1, preferredDay).toISOString(),
      totalPayment: payment,
      principal,
      interest,
      remainingBalance: balance,
      status: "Pending",
    };
  });
}

export function buildPaymentSchedule(input: BuildScheduleInput): {
  tem: number;
  monthlyPayment: number;
  totalToPay: number;
  totalInterest: number;
  schedule: PaymentScheduleItem[];
} {
  const tem = calculateTem(input.tea);
  const schedule =
    input.repaymentType === "DECREASING"
      ? buildDecreasingSchedule(input, tem)
      : buildFixedSchedule(input, tem);

  const totalToPay = round2(schedule.reduce((sum, item) => sum + item.totalPayment, 0));
  const totalInterest = round2(totalToPay - input.amount);
  const monthlyPayment = schedule.length > 0 ? schedule[0].totalPayment : 0;

  return {
    tem,
    monthlyPayment,
    totalToPay,
    totalInterest,
    schedule,
  };
}