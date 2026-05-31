import Box from "@mui/material/Box";

export const dynamic = "force-dynamic";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { notFound } from "next/navigation";

import { PaymentScheduleTable } from "@/components/PaymentScheduleTable";
import { getLoanById, getLoanSchedule } from "@/services/loanService";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

const loanTypeLabel: Record<string, string> = { Fixed: "Fijo", Decreasing: "Decreciente" };
const loanStatusLabel: Record<string, string> = { Pending: "Pendiente", Approved: "Aprobado", Rejected: "Rechazado", Active: "Activo", Completed: "Completado" };

export default async function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const loan = await getLoanById(numericId);

  if (!loan) {
    notFound();
  }

  const schedule = await getLoanSchedule(loan.id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={2} sx={{ p: 4, height: "100%" }}>
            <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" }, gap: 2 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Detalle de prestamo</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1, alignItems: "center" }}>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">Prestamo Id</Typography>
                    <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                      {loan.id}
                    </Typography>
                  </Box>
                  <Box sx={{ borderLeft: 1, borderColor: "divider", pl: 2 }}>
                    <Typography variant="caption" color="text.secondary">Usuario</Typography>
                    <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                      {loan.userId}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              {[
                { label: "Monto", value: currency(loan.amount) },
                { label: "Cuota mensual", value: currency(loan.monthlyPayment) },
                { label: "Tipo", value: loanTypeLabel[loan.loanType] ?? loan.loanType },
                { label: "Estado", value: loanStatusLabel[loan.status] ?? loan.status },
              ].map(({ label, value }) => (
                <Grid key={label} size={{ xs: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>{value}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card elevation={3} sx={{ p: 3, bgcolor: "primary.main", color: "primary.contrastText", height: "100%" }}>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.75)" }}>Parametros</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: "Tasa anual", value: `${loan.interestRate}%` },
                { label: "Plazo", value: `${loan.term} meses` },
                { label: "Creado", value: new Date(loan.createdAt).toLocaleString("es-MX") },
                { label: "Actualizado", value: loan.updatedAt ? new Date(loan.updatedAt).toLocaleString("es-MX") : "Sin cambios" },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: "primary.contrastText", fontWeight: 500 }}>{value}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <PaymentScheduleTable schedule={schedule} />
        </Grid>
      </Grid>
    </Container>
  );
}
