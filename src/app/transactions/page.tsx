import Box from "@mui/material/Box";

export const dynamic = "force-dynamic";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { TransactionWorkbench } from "@/components/TransactionWorkbench";
import { getLoans } from "@/services/loanService";
import { getTransactions } from "@/services/transactionService";

export default async function TransactionsPage() {
    const [transactions, loans] = await Promise.all([getTransactions(), getLoans()]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h6" >
                Lista de transacciones
            </Typography>
            <TransactionWorkbench initialTransactions={transactions} loans={loans} />
        </Container>
    );
}

