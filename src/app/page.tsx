import Box from "@mui/material/Box";

export const dynamic = "force-dynamic";

import { getLoans } from "@/services/loanService";
import { getTransactions } from "@/services/transactionService";
import HomeContent from "./HomeContent";

export default async function Home() {
  const [loans, transactions] = await Promise.all([
    getLoans(),
    getTransactions(),
  ]);

  return <HomeContent loans={loans} transactions={transactions} />;
}
