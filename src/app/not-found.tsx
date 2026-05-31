import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import Stack from "@mui/material/Stack";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h1" sx={{ fontSize: "4rem", fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Página no encontrada
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        La página que buscas no existe o ha sido movida.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="contained">Ir al inicio</Button>
        </Link>
      </Stack>
    </Container>
  );
}
