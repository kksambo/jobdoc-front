import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./components/Home";
import CV_Maker from "./components/CV_Maker";
import CoverLetterMaker from "./components/CoverLetterMaker";
import Register from "./components/Register";
import Login from "./components/Login";
import SupportingDocumentsPage from "./components/Documents";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/cv-builder" element={<CV_Maker />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/documents" element={<SupportingDocumentsPage />} />
          {/* Future */}
          <Route path="/cover-letters" element={<CoverLetterMaker />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
