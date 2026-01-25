import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";

const JobSearch = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [jobToTrack, setJobToTrack] = useState(null);

  // === SEARCH JOBS ===
  const handleSearch = async () => {
    if (!title) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/search?title=${encodeURIComponent(
          title,
        )}&location=${encodeURIComponent(location)}`,
      );
      const data = await res.json();

      const mappedJobs = data.map((job, index) => ({
        id: job.id || index,
        title: job.title,
        company: job.company?.display_name || "N/A",
        type: job.contract_type || "Full-time",
        experience: job.experience_level || "Junior",
        salary:
          job.salary_min && job.salary_max
            ? `R${job.salary_min.toLocaleString()} – R${job.salary_max.toLocaleString()}`
            : "Not specified",
        description: job.description || "No description",
        posted: job.created ? new Date(job.created).toDateString() : "N/A",
        source: "Adzuna",
        url: job.redirect_url,
      }));

      const filtered = mappedJobs.filter(
        (job) =>
          (!jobType || job.type === jobType) &&
          (!experience || job.experience === experience),
      );

      setResults(filtered);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job) => {
    setJobToTrack(job);
    setTrackDialogOpen(true);
  };

  const handleConfirmTrack = async () => {
    if (!jobToTrack) return;
    const personalInfoRaw = localStorage.getItem("personalInfo");
    const personalInfo = personalInfoRaw ? JSON.parse(personalInfoRaw) : null;

    const payload = {
      username: personalInfo?.username || null,
      email: personalInfo?.email || null,
      full_name: personalInfo?.full_name || null,
      title: jobToTrack.title,
      company: jobToTrack.company,
      location: location || personalInfo?.location || null,
      experience: jobToTrack.experience || null,
      job_type: jobToTrack.type || null,
      salary: jobToTrack.salary || null,
      source: jobToTrack.source || null,
      url: jobToTrack.url,
    };

    try {
      await fetch("http://localhost:8000/api/jobs/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      window.open(jobToTrack.url, "_blank");
    } catch (err) {
      console.error("Failed to track job:", err);
    } finally {
      setTrackDialogOpen(false);
      setJobToTrack(null);
    }
  };

  const handleCancelTrack = () => {
    setTrackDialogOpen(false);
    setJobToTrack(null);
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

      <Box sx={{ pt: 6, pb: 10, minHeight: "100vh", bgcolor: "#f5f7fb" }}>
        <Container maxWidth="lg">
          {/* HEADER */}
          <Box textAlign="center" mb={6}>
            <Chip icon={<WorkIcon />} label="Job Search" />
            <Typography variant="h4" fontWeight={700} mt={1}>
              Find Your Next Opportunity
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Search for jobs that match your skills
            </Typography>
          </Box>

          {/* SEARCH FORM */}
          <Card sx={{ p: 4, mb: 6 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Job Type"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Entry">Entry</MenuItem>
                  <MenuItem value="Junior">Junior</MenuItem>
                  <MenuItem value="Mid">Mid</MenuItem>
                  <MenuItem value="Senior">Senior</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ height: "100%" }}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* RESULTS */}
          {results.length > 0 && (
            <>
              <Typography variant="h6" mb={3} fontWeight={600}>
                {results.length} Jobs Found
              </Typography>

              <Grid container spacing={3}>
                {results.map((job) => (
                  <Grid item xs={12} md={6} key={job.id}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: 8,
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <WorkIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                              {job.title}
                            </Typography>
                          </Box>

                          <Typography color="text.secondary">
                            {job.company} • {job.posted}
                          </Typography>

                          <Typography fontSize={14}>
                            {job.description}
                          </Typography>
                          <Typography fontWeight={600}>{job.salary}</Typography>

                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={job.type} size="small" />
                            <Chip label={job.experience} size="small" />
                            <Chip
                              label={job.source}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                        <Button
                          variant="contained"
                          endIcon={<OpenInNewIcon />}
                          onClick={() => handleApplyClick(job)}
                        >
                          Apply
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {results.length === 0 && !loading && (
            <Typography textAlign="center" mt={4} color="text.secondary">
              No jobs found. Try changing your search criteria.
            </Typography>
          )}

          {/* TRACK DIALOG */}
          <Dialog open={trackDialogOpen} onClose={handleCancelTrack}>
            <DialogTitle>Track Job Application?</DialogTitle>
            <DialogContent>
              <Typography>
                Do you want to save this job to track your application progress?
              </Typography>
              {jobToTrack && (
                <Box mt={2}>
                  <Typography fontWeight={600}>{jobToTrack.title}</Typography>
                  <Typography color="text.secondary">
                    {jobToTrack.company}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelTrack}>Cancel</Button>
              <Button variant="contained" onClick={handleConfirmTrack}>
                Track & Apply
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default JobSearch;
