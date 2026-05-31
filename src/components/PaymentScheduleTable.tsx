import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { PaymentScheduleItem } from "@/types/loan";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

const paymentStatusLabel: Record<string, string> = { Pending: "Pendiente", Paid: "Pagado" };

type PaymentScheduleTableProps = {
  schedule: PaymentScheduleItem[];
};

export function PaymentScheduleTable({ schedule }: PaymentScheduleTableProps) {
  if (schedule.length === 0) {
    return (
      <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No hay cronograma disponible para este prestamo todavia.</Typography>
      </Card>
    );
  }

  return (
    <TableContainer component={Card} elevation={1}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell>Cuota</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Capital</TableCell>
            <TableCell align="right">Interes</TableCell>
            <TableCell align="right">Pago</TableCell>
            <TableCell align="right">Saldo</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.map((item) => (
            <TableRow key={`${item.loanId}-${item.paymentNumber}`} hover>
              <TableCell>{item.paymentNumber}</TableCell>
              <TableCell>{new Date(item.dueDate).toLocaleDateString("es-MX")}</TableCell>
              <TableCell align="right">{currency(item.principal)}</TableCell>
              <TableCell align="right">{currency(item.interest)}</TableCell>
              <TableCell align="right"><strong>{currency(item.totalPayment)}</strong></TableCell>
              <TableCell align="right">{currency(item.remainingBalance)}</TableCell>
              <TableCell>
                <Chip label={paymentStatusLabel[item.status] ?? item.status} size="small" variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

