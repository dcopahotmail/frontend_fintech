"use client";

import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";

export default function LayoutWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
