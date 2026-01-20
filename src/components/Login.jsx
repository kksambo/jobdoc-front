import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("https://jobdoc-generator.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.access_token);
        navigate("/home");
      } else {
        alert(result.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Welcome Back
        </Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={credentials.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3, borderRadius: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Divider sx={{ my: 3 }}>OR</Divider>

        {/* ✅ Register Button */}
        <Button
          variant="outlined"
          fullWidth
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("/register")}
        >
          Create an Account
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
