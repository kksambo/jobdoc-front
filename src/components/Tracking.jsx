import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Applied: "info",
  Interview: "warning",
  Offer: "success",
  Rejected: "error",
};

export default function JobTracker() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const personalInfoRaw = localStorage.getItem("personalInfo");
  const personalInfo = personalInfoRaw ? JSON.parse(personalInfoRaw) : null;
  const username = personalInfo?.username;

  useEffect(() => {
    if (!username) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/jobs?username=${username}`,
        );
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [username]);

  const handleStatusChange = (jobId, newStatus) => {
    if (newStatus === "Interview") {
      setCurrentJobId(jobId);
      setOpenModal(true);
      return;
    }
    updateStatus(jobId, newStatus);
  };

  const updateStatus = async (jobId, status) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/tracked/${jobId}?status=${encodeURIComponent(
          status,
        )}`,
        { method: "PATCH" },
      );
      if (!res.ok) throw new Error("Failed to update status");

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status } : job)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDateConfirm = () => {
    if (!selectedDate) return;

    const d = new Date(selectedDate);
    const formattedDate = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;

    const statusWithDate = `Interview-${formattedDate}`;
    updateStatus(currentJobId, statusWithDate);

    setOpenModal(false);
    setSelectedDate("");
    setCurrentJobId(null);
  };

  return (
    <>
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: "#fff", boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            Career Tracker
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{ textTransform: "none" }}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* SMALL BACK BUTTON */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          minWidth: "auto",
          padding: "4px 8px",
          fontSize: 14,
          borderRadius: 1,
          textTransform: "none",
        }}
      >
        Back
      </Button>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ p: 5 }}>
          <Box textAlign="center" mb={3}>
            <Chip icon={<WorkOutlineIcon />} label="Job Tracker" />
            <Typography variant="h4" fontWeight={700} mt={1}>
              Track Your Applications
            </Typography>
            <Typography variant="subtitle1" mt={1}>
              Welcome, {personalInfo?.full_name || username}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Typography sx={{ mt: 3 }}>
              You haven’t tracked any jobs yet.
            </Typography>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {jobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography color="text.secondary">
                        {job.company}
                      </Typography>
                      <Typography sx={{ mt: 1 }}>
                        📍 {job.location || "N/A"}
                      </Typography>
                      <Typography sx={{ mt: 1 }}>
                        Source: {job.source || "Unknown"}
                      </Typography>

                      <Box sx={{ mt: 2, mb: 2 }}>
                        <Chip
                          label={job.status}
                          color={
                            statusColors[job.status.split("-")[0]] || "default"
                          }
                        />
                      </Box>

                      <Select
                        fullWidth
                        size="small"
                        value={
                          job.status.startsWith("Interview")
                            ? "Interview"
                            : job.status
                        }
                        onChange={(e) =>
                          handleStatusChange(job.id, e.target.value)
                        }
                      >
                        <MenuItem value="Applied">Applied</MenuItem>
                        <MenuItem value="Interview">Interview</MenuItem>
                        <MenuItem value="Offer">Offer</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>

                      {job.url && (
                        <Button
                          fullWidth
                          sx={{ mt: 2 }}
                          variant="outlined"
                          onClick={() => window.open(job.url, "_blank")}
                        >
                          View Job Posting
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      {/* INTERVIEW DATE MODAL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Choose Interview Date</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            fullWidth
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDateConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
