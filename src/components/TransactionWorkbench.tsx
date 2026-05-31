"use client";

import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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
import { createTransaction } from "@/services/transactionService";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userIdFilter, setUserIdFilter] = useState("");
    const [form, setForm] = useState<CreateTransactionInput>({
        idempotencyKey: uuidv4(),
        type: 1,
        amount: 150,
        loanId: null,
        description: "Pago de prueba desde frontend",
    });
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loanUserById = useMemo(() => {
        return new Map(loans.map((loan) => [loan.id, loan.userId]));
    }, [loans]);

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter((item) => {
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
            })
            .map((item) => ({
                ...item,
                userId: item.loanId !== null ? (loanUserById.get(item.loanId) ?? null) : null,
            }));
    }, [transactions, typeFilter, statusFilter, loanUserById]);

    function openCreateDialog() {
        setError(null);
        setMessage(null);
        setUserIdFilter("");
        setForm({
            idempotencyKey: uuidv4(),
            type: 1,
            amount: 150,
            loanId: null,
            description: "Pago de prueba desde frontend",
        });
        setIsDialogOpen(true);
    }

    function closeCreateDialog() {
        setIsDialogOpen(false);
    }

    async function submitTransaction() {
        setError(null);
        setMessage(null);
        try {
            const created = await createTransaction(form);

            setTransactions((current) => {
                const exists = current.some((item) => item.id === created.id);
                return exists ? current : [created, ...current];
            });
            setMessage(`Transaccion #${created.id} creada correctamente.`);
            setIsDialogOpen(false);
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : "Ocurrio un error al crear la transaccion.");
        }
    }

    return (
        <Stack spacing={3}>
            <Card elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Filtros</Typography>
                <Grid container spacing={2.5}>
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
                </Grid>
            </Card>

            <Dialog open={isDialogOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
                <DialogTitle>Simular transaccion</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Box sx={{ p: 1.5, border: 1, borderColor: "divider", borderRadius: 1.5, bgcolor: "grey.50" }}>
                            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">Idempotency Key</Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    fontSize: "0.82rem",
                                    lineHeight: 1.5,
                                    whiteSpace: "normal",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {form.idempotencyKey}
                            </Typography>
                        </Box>

                        <FormControl fullWidth size="small">
                            <InputLabel>Prestamo asociado</InputLabel>
                            <Select
                                label="Prestamo asociado"
                                value={form.loanId !== null ? String(form.loanId) : ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setForm((current) => ({
                                        ...current,
                                        loanId: value === "" ? null : Number(value),
                                    }));
                                }}
                            >
                                <MenuItem value="">Sin prestamo</MenuItem>
                                {loans.map((loan) => (
                                    <MenuItem key={loan.id} value={String(loan.id)}>
                                        #{loan.id} - {loan.userId} - ${loan.amount.toLocaleString("en-US")}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                label="Tipo"
                                value={form.type}
                                onChange={(e) => setForm((current) => ({ ...current, type: Number(e.target.value) as 0 | 1 | 2 }))}
                            >
                                <MenuItem value={0}>Desembolso</MenuItem>
                                <MenuItem value={1}>Pago</MenuItem>
                                <MenuItem value={2}>Transferencia</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Monto"
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm((current) => ({ ...current, amount: Number(e.target.value) }))}
                            size="small"
                            fullWidth
                            slotProps={{ htmlInput: { min: 0.01 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreateDialog}>Cancelar</Button>
                    <Button onClick={submitTransaction} variant="contained" disabled={form.amount <= 0}>
                        Simular Pago
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button sx={{ borderRadius: '2rem' }} startIcon={<AddIcon />} variant="contained" onClick={openCreateDialog}>
                    Simular transaccion
                </Button>
            </Box>

            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <TransactionList transactions={filteredTransactions} />
        </Stack>
    );
}
