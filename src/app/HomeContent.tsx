"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { Loan } from "@/types/loan";
import type { Transaction } from "@/types/transaction";

function currency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function HomeContent({
    loans,
    transactions,
}: {
    loans: Loan[];
    transactions: Transaction[];
}) {
    const portfolioBalance = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const monthlyVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const activeLoans = loans.filter((l) => l.status === "Active" || l.status === "Approved").length;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bienvenido a FinTech Dashboard
                </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    {
                        label: "Prestamos activos",
                        value: String(activeLoans),
                    },
                    {
                        label: "Monto originado",
                        value: currency(portfolioBalance),
                    },
                    {
                        label: "Volumen transaccional",
                        value: currency(monthlyVolume),
                    },
                ].map(({ label, value }) => (
                    <Grid key={label} size={{ xs: 12, md: 4 }}>
                        <Card elevation={1} sx={{ p: 3, height: "100%" }}>
                            <Typography variant="body2" color="text.secondary">
                                {label}
                            </Typography>
                            <Typography variant="h3" sx={{ my: 1, fontSize: "2rem" }}>
                                {value}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
