import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";

export const dynamic = "force-dynamic";
import Typography from "@mui/material/Typography";

import { LoanSimulator } from "@/components/LoanSimulator";

export default function LoanSimulationPage() {
    const initialValues = {
        userId: "user-demo",
        monthlyIncome: 4500,
        amount: 9000,
        tea: 24,
        term: 12,
        loanType: 0 as const,
        startDate: new Date().toISOString().slice(0, 10),
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h6" sx={{ mt: 1 }}>
                Simulador de prestamos
            </Typography>
            <LoanSimulator initialValues={initialValues} />
        </Container>
    );
}
