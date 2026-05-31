"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PaymentScheduleTable } from "@/components/PaymentScheduleTable";
import { buildPaymentSchedule } from "@/lib/loanCalculator";
import { createLoan } from "@/services/loanService";
import type { Loan } from "@/types/loan";

type RepaymentType = "FIXED" | "DECREASING";

type LoanSimulatorForm = {
  userId: string;
  monthlyIncome: number;
  amount: number;
  tea: number;
  term: number;
  loanType: 0 | 1;
  startDate: string;
};

type LoanSimulatorProps = {
  initialValues: LoanSimulatorForm;
};

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function LoanSimulator({ initialValues }: LoanSimulatorProps) {
  const [form, setForm] = useState(initialValues);
  const [createdLoan, setCreatedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const simulation = useMemo(
    () =>
      buildPaymentSchedule({
        amount: form.amount,
        tea: form.tea,
        term: form.term,
        repaymentType: form.loanType === 0 ? "FIXED" : "DECREASING",
        startDate: form.startDate,
      }),
    [form.amount, form.tea, form.term, form.loanType, form.startDate],
  );

  const validations = useMemo(() => {
    const issues: string[] = [];
    if (!form.userId.trim()) issues.push("Usuario obligatorio.");
    if (form.amount < 500 || form.amount > 50000) issues.push("Monto entre $500 y $50,000.");
    if (form.term < 6 || form.term > 60) issues.push("Plazo entre 6 y 60 meses.");
    if (form.tea < 18 || form.tea > 35) issues.push("TEA entre 18% y 35%.");
    if (form.monthlyIncome <= 0) issues.push("Ingreso mensual debe ser mayor a 0.");
    return issues;
  }, [form]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validations.length > 0) {
      setError(validations.join(" "));
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);
    setCreatedLoan(null);

    try {
      const loan = await createLoan({
        userId: form.userId,
        amount: form.amount,
        term: form.term,
        interestRate: form.tea,
        loanType: form.loanType,
      });

      setCreatedLoan(loan);
      setMessage(`Prestamo #${loan.id} creado correctamente.`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Ocurrio un error al crear el prestamo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>

      {/* ── Formulario ── */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <Card elevation={1} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>Parámetros del préstamo</Typography>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>

            <Typography variant="overline" color="text.secondary">Solicitante</Typography>
            <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Usuario"
                  value={form.userId}
                  onChange={(e) => setForm((c) => ({ ...c, userId: e.target.value }))}
                  fullWidth size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Ingreso mensual"
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(e) => setForm((c) => ({ ...c, monthlyIncome: Number(e.target.value) }))}
                  fullWidth size="small"
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>
            </Grid>

            <Typography variant="overline" color="text.secondary">Condiciones</Typography>
            <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Monto solicitado ($)"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((c) => ({ ...c, amount: Number(e.target.value) }))}
                  fullWidth size="small"
                  slotProps={{ htmlInput: { min: 500, max: 50000 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Plazo (meses)"
                  type="number"
                  value={form.term}
                  onChange={(e) => setForm((c) => ({ ...c, term: Number(e.target.value) }))}
                  fullWidth size="small"
                  slotProps={{ htmlInput: { min: 6, max: 60 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tasa anual — TEA (%)"
                  type="number"
                  value={form.tea}
                  onChange={(e) => setForm((c) => ({ ...c, tea: Number(e.target.value) }))}
                  fullWidth size="small"
                  slotProps={{ htmlInput: { min: 18, max: 35 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de préstamo</InputLabel>
                  <Select
                    label="Tipo de préstamo"
                    value={form.loanType}
                    onChange={(e) => setForm((c) => ({ ...c, loanType: Number(e.target.value) as 0 | 1 }))}
                  >
                    <MenuItem value={0}>Fijo (Sistema francés)</MenuItem>
                    <MenuItem value={1}>Decreciente (Sistema alemán)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Fecha primer pago"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((c) => ({ ...c, startDate: e.target.value }))}
                  fullWidth size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            {validations.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {validations.map((v) => <div key={v}>{v}</div>)}
              </Alert>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || validations.length > 0}
                size="large"
                sx={{ flex: 1 }}
              >
                {isLoading ? "Procesando..." : "Crear préstamo"}
              </Button>
              {createdLoan && (
                <Button variant="outlined" size="large" component={Link} href={`/loans/${createdLoan.id}`}>
                  Ver detalle
                </Button>
              )}
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Card elevation={2} sx={{ p: 3, bgcolor: "primary.main", color: "primary.contrastText", height: "100%" }}>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>Resumen de simulación</Typography>
          <Typography variant="h5" sx={{ mt: 0.5, mb: 2.5 }}>
            {currency(form.amount)} a {form.term} meses
          </Typography>
          <Grid container spacing={1.5}>
            {[
              { label: "Cuota mensual", value: currency(simulation.monthlyPayment) },
              { label: "Interés total", value: currency(simulation.totalInterest) },
              { label: "TEA", value: `${form.tea.toFixed(2)}%` },
              { label: "TEM", value: `${(simulation.tem * 100).toFixed(4)}%` },
            ].map(({ label, value }) => (
              <Grid key={label} size={{ xs: 6 }}>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.12)", borderRadius: 1, p: 1.5 }}>
                  <Typography variant="caption" sx={{ opacity: 0.75, display: "block" }}>{label}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" sx={{ display: "block", mt: 2, opacity: 0.65 }}>
            Regla: cuota activa + nueva cuota ≤ 40% del ingreso mensual.
          </Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card elevation={1} sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary">Cronograma de pagos</Typography>
          <Typography variant="h6" sx={{ mt: 0.5, mb: 2 }}>Tabla de amortización</Typography>
          <Divider sx={{ mb: 2 }} />
          <PaymentScheduleTable schedule={simulation.schedule} showStatus={false} />
        </Card>
      </Grid>

    </Grid>
  );
}
