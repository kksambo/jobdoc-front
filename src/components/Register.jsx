import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonalInfoForm from "./PersonalInfoForm";

const Register = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "https://jobdoc-generator.onrender.com/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        navigate("/");
      } else {
        alert(result.detail || "Failed to register");
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
          maxWidth: 800,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Create Your Account
        </Typography>

        {/* Personal Info Section */}
        <PersonalInfoForm data={data} onChange={handleChange} />

        {/* Login Credentials */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Username"
              fullWidth
              value={data.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={data.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4, borderRadius: 2 }}
          fullWidth
          onClick={handleSubmit}
        >
          Register
        </Button>

        <Divider sx={{ my: 3 }}>Already have an account?</Divider>

        {/* ✅ Login Button */}
        <Button
          variant="outlined"
          size="large"
          fullWidth
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("/")}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;
