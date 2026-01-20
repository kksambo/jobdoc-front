import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Job Document Assistant</Typography>
        </Toolbar>
      </AppBar>

      <Sidebar open={open} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
