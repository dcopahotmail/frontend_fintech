"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import type { Loan } from "@/types/loan";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const statusColor: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
  Approved: "success",
  Active: "info",
  Completed: "default",
  Rejected: "error",
  Pending: "warning",
};

const statusLabel: Record<string, string> = {
  Approved: "Aprobado",
  Active: "Activo",
  Completed: "Completado",
  Rejected: "Rechazado",
  Pending: "Pendiente",
};

const loanTypeLabel: Record<string, string> = {
  Fixed: "Fijo",
  Decreasing: "Decreciente",
};

type LoanListProps = {
  loans: Loan[];
};

export function LoanList({ loans }: LoanListProps) {
  if (loans.length === 0) {
    return (
      <Card variant="outlined" sx={{ p: 5, textAlign: "center" }}>
        <Typography color="text.secondary">El backend no devolvio prestamos todavia.</Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      {loans.map((loan) => (
        <Card key={loan.id} elevation={1} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: { md: "flex-start" }, gap: 2 }}>
            <Box>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                <Typography variant="h5">Prestamo #{loan.id}</Typography>
                <Chip label={loan.userId} size="small" variant="outlined" />
                <Chip
                  label={statusLabel[loan.status] ?? loan.status}
                  size="small"
                  color={statusColor[loan.status] ?? "default"}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tipo {loanTypeLabel[loan.loanType] ?? loan.loanType}. Creado el {new Date(loan.createdAt).toLocaleDateString("es-MX")}.
              </Typography>
            </Box>
            <Box sx={{ textAlign: { md: "right" } }}>
              <Typography variant="caption" color="text.secondary">Monto solicitado</Typography>
              <Typography variant="h4" sx={{ mt: 0.5 }}>{currency(loan.amount)}</Typography>
            </Box>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {[
              { label: "Tasa anual", value: `${loan.interestRate}%` },
              { label: "Plazo", value: `${loan.term} meses` },
              { label: "Cuota mensual", value: currency(loan.monthlyPayment) },
              { label: "Actualizado", value: loan.updatedAt ? new Date(loan.updatedAt).toLocaleDateString("es-MX") : "Sin cambios" },
            ].map(({ label, value }) => (
              <Grid key={label} size={{ xs: 6, md: 3 }}>
                <Card variant="outlined" sx={{ p: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>{value}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 3, pt: 2, borderTop: 1, borderColor: "divider", flexWrap: "wrap", gap: 2 }}>
            <Stack direction="row" sx={{ gap: 1.5 }}>
              <Button variant="outlined" size="small" component={Link} href={`/loans/${loan.id}`}>
                Ver detalle
              </Button>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
