import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  TextField,
} from "@mui/material";

import {
  Download,
  Preview,
  Save,
  CheckCircle,
  AutoAwesome,
  Home as HomeIcon,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

const steps = ["Personal Info", "Recipient Info", "Letter Body", "Preview"];
const LOCAL_STORAGE_KEY = "coverLetterData";
const API_BASE = "https://jobdoc-generator.onrender.com";

const CoverLetterMaker = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState("");
  const [templatesList, setTemplatesList] = useState([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [letterData, setLetterData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          full_name: "",
          job_title: "",
          email: "",
          phone: "",
          location: "",
          recipient_name: "",
          recipient_company: "",
          recipient_position: "",
          letter_body: "",
        };
  });

  // =========================
  // Fetch logged-in user info
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedData = { ...letterData, ...data };
        setLetterData(updatedData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // FETCH TEMPLATES
  // =========================
  useEffect(() => {
    fetch(`${API_BASE}/api/cover-letter/templates`)
      .then((res) => res.json())
      .then((data) => {
        setTemplatesList(data.templates || []);
        if (data.templates?.length) setTemplate(data.templates[0]);
      })
      .catch(console.error);
  }, []);

  const handleInputChange = (field, value) => {
    const updated = { ...letterData, [field]: value };
    setLetterData(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setAutoSaveStatus("Saving...");
    setTimeout(() => setAutoSaveStatus("Saved"), 800);
  };

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  // =========================
  // PROGRESS
  // =========================
  const sections = {
    personal: ["full_name", "job_title", "email", "phone", "location"],
    recipient: ["recipient_name", "recipient_company", "recipient_position"],
    body: ["letter_body"],
  };

  const overallProgress = Math.round(
    Object.values(sections).reduce((acc, fields) => {
      const filled = fields.filter((f) => letterData[f]).length;
      return acc + (filled / fields.length) * 100;
    }, 0) / Object.keys(sections).length,
  );

  // =========================
  // AI GENERATION
  // =========================
  const handleGenerateWithAI = async () => {
    try {
      setAiLoading(true);

      const res = await fetch(`${API_BASE}/api/cover-letter/generate-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: letterData,
          user_input: aiInput,
        }),
      });

      const data = await res.json();
      handleInputChange("letter_body", data.generated_text);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // =========================
  // PREVIEW & DOWNLOAD
  // =========================
  const handleGeneratePreview = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/cover-letter/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, cover_letter: letterData }),
    });
    setPreviewHtml(await res.text());
    setActiveStep(3);
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/cover-letter/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, cover_letter: letterData }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: "My_Cover_Letter.pdf",
    }).click();
    setLoading(false);
  };

  // =========================
  // STEP CONTENT
  // =========================
  const getStepContent = () => {
    if (activeStep === 0)
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          {["full_name", "job_title", "email", "phone", "location"].map((f) => (
            <TextField
              key={f}
              label={f.replace("_", " ").toUpperCase()}
              value={letterData[f]}
              onChange={(e) => handleInputChange(f, e.target.value)}
            />
          ))}
        </Box>
      );

    if (activeStep === 1)
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          {["recipient_name", "recipient_company", "recipient_position"].map(
            (f) => (
              <TextField
                key={f}
                label={f.replace("_", " ").toUpperCase()}
                value={letterData[f]}
                onChange={(e) => handleInputChange(f, e.target.value)}
              />
            ),
          )}
        </Box>
      );

    if (activeStep === 2)
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Describe what you want (AI will write it)"
            multiline
            rows={3}
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <Button
            startIcon={<AutoAwesome />}
            variant="contained"
            onClick={handleGenerateWithAI}
            disabled={aiLoading || !aiInput}
          >
            {aiLoading ? "Generating..." : "Use AI ✨"}
          </Button>
          <TextField
            label="Cover Letter Content"
            multiline
            rows={8}
            value={letterData.letter_body}
            onChange={(e) => handleInputChange("letter_body", e.target.value)}
          />
        </Box>
      );

    return (
      <Box
        sx={{ border: "1px solid #ddd", p: 2 }}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    );
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#fff" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/home"
            sx={{
              textDecoration: "none",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            📄 CareerCraft
          </Typography>
          <Button component={Link} to="/home" startIcon={<HomeIcon />}>
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ p: 5 }}>
          <Box textAlign="center" mb={3}>
            <Chip icon={<AutoAwesome />} label="AI Cover Letter Builder" />
            <Typography variant="h4" fontWeight={700}>
              Professional Cover Letter Maker
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Template</InputLabel>
            <Select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {templatesList.map((t) => (
                <MenuItem key={t} value={t}>
                  {t.replace(".html", "")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((s) => (
              <Step key={s}>
                <StepLabel>{s}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card sx={{ my: 3 }}>
            <CardContent>
              <Typography>Completion</Typography>
              <LinearProgress value={overallProgress} variant="determinate" />
            </CardContent>
          </Card>

          {autoSaveStatus && (
            <Fade in>
              <Box display="flex" justifyContent="flex-end">
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="caption">{autoSaveStatus}</Typography>
              </Box>
            </Fade>
          )}

          <Box my={4}>{getStepContent()}</Box>

          <Box display="flex" gap={2}>
            <Button disabled={activeStep === 0} onClick={handleBack} fullWidth>
              Back
            </Button>
            {activeStep === 3 ? (
              <>
                <Button
                  onClick={handleGeneratePreview}
                  startIcon={<Preview />}
                  fullWidth
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Download />}
                  onClick={handleDownloadPDF}
                  fullWidth
                >
                  Download
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<Save />}
                fullWidth
              >
                Save & Continue
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CoverLetterMaker;
