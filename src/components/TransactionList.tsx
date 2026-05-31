import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { Transaction } from "@/types/transaction";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const statusColor: Record<string, "default" | "success" | "error" | "warning"> = {
  Completed: "success",
  Failed: "error",
  Pending: "warning",
};

const statusLabel: Record<string, string> = {
  Completed: "Completada",
  Failed: "Fallida",
  Pending: "Pendiente",
};

const typeLabel: Record<string, string> = {
  Disbursement: "Desembolso",
  Payment: "Pago",
  Transfer: "Transferencia",
};

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card variant="outlined" sx={{ p: 5, textAlign: "center" }}>
        <Typography color="text.secondary">El backend no devolvio transacciones todavia.</Typography>
      </Card>
    );
  }

  return (
    <TableContainer component={Card} elevation={1}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell>Transaccion</TableCell>
            <TableCell>Idempotency key</TableCell>
            <TableCell>Prestamo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>TX #{transaction.id}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {transaction.description ?? "Sin descripcion"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                  {transaction.idempotencyKey ?? "No informado"}
                </Typography>
              </TableCell>
              <TableCell>{transaction.loanId ?? "Sin prestamo"}</TableCell>
              <TableCell>{typeLabel[transaction.type] ?? transaction.type}</TableCell>
              <TableCell align="right"><strong>{currency(transaction.amount)}</strong></TableCell>
              <TableCell>
                <Chip
                  label={statusLabel[transaction.status] ?? transaction.status}
                  size="small"
                  color={statusColor[transaction.status] ?? "default"}
                />
              </TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleString("es-MX")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}