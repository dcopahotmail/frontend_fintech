import Box from "@mui/material/Box";

export const dynamic = "force-dynamic";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { LoanList } from "@/components/LoanList";
import { getLoans } from "@/services/loanService";

export default async function LoansPage() {
  const loans = await getLoans();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Prestamos</Typography>
      <LoanList loans={loans} />
    </Container>
  );
}
