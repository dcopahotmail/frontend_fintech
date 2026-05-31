"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { TransactionList } from "@/components/TransactionList";
import type { Loan } from "@/types/loan";
import type { CreateTransactionInput, Transaction } from "@/types/transaction";

type TransactionWorkbenchProps = {
  initialTransactions: Transaction[];
  loans: Loan[];
};

export function TransactionWorkbench({ initialTransactions, loans }: TransactionWorkbenchProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [typeFilter, setTypeFilter] = useState<"" | "0" | "1" | "2">("");
  const [statusFilter, setStatusFilter] = useState<"" | "0" | "1" | "2">("");
  const [form, setForm] = useState<CreateTransactionInput>({
    idempotencyKey: uuidv4(),
    type: 1,
    amount: 150,
    loanId: null,
    description: "Pago de prueba desde frontend",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesType =
        typeFilter === "" ||
        (typeFilter === "0" && item.type === "Disbursement") ||
        (typeFilter === "1" && item.type === "Payment") ||
        (typeFilter === "2" && item.type === "Transfer");
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "0" && item.status === "Pending") ||
        (statusFilter === "1" && item.status === "Completed") ||
        (statusFilter === "2" && item.status === "Failed");
      return matchesType && matchesStatus;
    });
  }, [transactions, typeFilter, statusFilter]);

  async function submitTransaction(sendDuplicate: boolean) {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const first = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const firstBody = (await first.json()) as Transaction | { message: string };
      if (!first.ok) throw new Error("message" in firstBody ? firstBody.message : "No se pudo crear transaccion.");

      let lastTransaction = firstBody as Transaction;
      let deduplicated = false;

      if (sendDuplicate) {
        const second = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const secondBody = (await second.json()) as Transaction | { message: string };
        if (!second.ok) throw new Error("message" in secondBody ? secondBody.message : "Fallo al reenviar transaccion.");
        lastTransaction = secondBody as Transaction;
        deduplicated = lastTransaction.id === (firstBody as Transaction).id;
      }

      setTransactions((current) => {
        const exists = current.some((item) => item.id === lastTransaction.id);
        return exists ? current : [lastTransaction, ...current];
      });
      setMessage(
        sendDuplicate
          ? deduplicated
            ? `Idempotencia validada: la segunda solicitud devolvio la transaccion #${lastTransaction.id}.`
            : "Se enviaron dos solicitudes y se crearon transacciones diferentes."
          : `Transaccion #${lastTransaction.id} creada correctamente.`,
      );
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Ocurrio un error al crear la transaccion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Card elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Filtros y nueva transaccion</Typography>
        <Grid container spacing={2.5}>
          {/* Filters */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtro por tipo</InputLabel>
              <Select
                label="Filtro por tipo"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "" | "0" | "1" | "2")}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="0">Desembolso</MenuItem>
                <MenuItem value="1">Pago</MenuItem>
                <MenuItem value="2">Transferencia</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtro por estado</InputLabel>
              <Select
                label="Filtro por estado"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "" | "0" | "1" | "2")}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="0">Pendiente</MenuItem>
                <MenuItem value="1">Completada</MenuItem>
                <MenuItem value="2">Fallida</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Form fields */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Idempotency key"
              value={form.idempotencyKey}
              onChange={(e) => setForm((c) => ({ ...c, idempotencyKey: e.target.value }))}
              fullWidth size="small"
              slotProps={{ input: { style: { fontFamily: "monospace", fontSize: "0.8rem" } } }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={form.type}
                onChange={(e) => setForm((c) => ({ ...c, type: Number(e.target.value) as 0 | 1 | 2 }))}
              >
                <MenuItem value={0}>Desembolso</MenuItem>
                <MenuItem value={1}>Pago</MenuItem>
                <MenuItem value={2}>Transferencia</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              label="Monto"
              type="number"
              value={form.amount}
              onChange={(e) => setForm((c) => ({ ...c, amount: Number(e.target.value) }))}
              fullWidth size="small"
              slotProps={{ htmlInput: { min: 0.01 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Prestamo asociado (opcional)</InputLabel>
              <Select
                label="Prestamo asociado (opcional)"
                value={form.loanId !== null ? String(form.loanId) : ""}
                onChange={(e) =>
                  setForm((c) => ({ ...c, loanId: e.target.value === "" ? null : Number(e.target.value) }))
                }
              >
                <MenuItem value="">Sin prestamo</MenuItem>
                {loans.map((loan) => (
                  <MenuItem key={loan.id} value={loan.id}>
                    #{loan.id} - {loan.userId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 2.5 }}>
          <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => submitTransaction(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Crear transaccion de prueba"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => submitTransaction(true)}
              disabled={isSubmitting}
            >
              Enviar dos veces (probar idempotencia)
            </Button>
            <Button
              variant="text"
              onClick={() => setForm((c) => ({ ...c, idempotencyKey: uuidv4() }))}
            >
              Generar nueva key
            </Button>
          </Stack>
        </Box>
      </Card>

      <TransactionList transactions={filteredTransactions} />
    </Stack>
  );
}
