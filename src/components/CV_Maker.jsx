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

import PersonalInfoForm from "./PersonalInfoForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import PreviewPanel from "./PreviewPanel";

const steps = ["Personal Info", "Experience", "Education", "Skills", "Preview"];
const LOCAL_STORAGE_KEY = "cvData";
const API_BASE = "https://jobdoc-generator.onrender.com";

const CV_Maker = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cvData, setCvData] = useState({
    full_name: "",
    job_title: "",
    email: "",
    phone: "",
    location: "",
    profile_summary: "",
    role: "",
    company_name: "",
    start_date: "",
    end_date: "",
    duties: [],
    qualification: "",
    institution: "",
    graduation_year: "",
    skills: [],
  });
  const [template, setTemplate] = useState("");
  const [templatesList, setTemplatesList] = useState([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // =========================
  // FETCH /me ONCE
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await res.json();
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        const merged = saved ? { ...userData, ...JSON.parse(saved) } : userData;
        setCvData(merged);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        console.error("Failed to fetch /me:", err);
      }
    };

    fetchMe();
  }, []); // <-- empty dependency array ensures it runs once

  // =========================
  // FETCH TEMPLATES
  // =========================
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cv/cv-templates`);
        const data = await res.json();
        setTemplatesList(data.templates || []);
        if (data.templates?.length) setTemplate(data.templates[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleInputChange = (field, value) => {
    const newData = { ...cvData, [field]: value };
    setCvData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    setAutoSaveStatus("Saving...");
    setTimeout(() => setAutoSaveStatus("Saved"), 900);
  };

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  // =========================
  // OVERALL PROGRESS
  // =========================
  const sectionConfig = {
    personal: [
      "full_name",
      "job_title",
      "email",
      "phone",
      "location",
      "profile_summary",
    ],
    experience: ["role", "company_name", "start_date", "end_date", "duties"],
    education: ["qualification", "institution", "graduation_year"],
    skills: ["skills"],
  };

  const getSectionProgress = (fields, data) => {
    const filled = fields.filter((f) => {
      const v = data[f];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const overallProgress = Math.round(
    Object.values(sectionConfig).reduce(
      (acc, fields) => acc + getSectionProgress(fields, cvData),
      0,
    ) / Object.values(sectionConfig).length,
  );

  // =========================
  // GET STEP CONTENT
  // =========================
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInfoForm data={cvData} onChange={handleInputChange} />;
      case 1:
        return <ExperienceForm data={cvData} onChange={handleInputChange} />;
      case 2:
        return <EducationForm data={cvData} onChange={handleInputChange} />;
      case 3:
        return <SkillsForm data={cvData} onChange={handleInputChange} />;
      case 4:
        return <PreviewPanel html={previewHtml} />;
      default:
        return null;
    }
  };

  // =========================
  // PREVIEW & DOWNLOAD
  // =========================
  const handleGeneratePreview = async () => {
    if (!template) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cv/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, cv: cvData }),
      });
      const html = await res.text();
      setPreviewHtml(html);
      setActiveStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cv/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, cv: cvData }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "My_CV.pdf";
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <Button
            component={Link}
            to="/home"
            startIcon={<HomeIcon />}
            variant="outlined"
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
          <Box textAlign="center" mb={3}>
            <Chip
              icon={<AutoAwesome />}
              label="Smart CV Builder"
              color="primary"
            />
            <Typography fontWeight={700} sx={{ mt: 1, fontSize: "2.4rem" }}>
              Professional CV Maker
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Build a job-ready CV with clean design and perfect structure
            </Typography>

            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Choose Template</InputLabel>
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
            </Box>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, i) => (
              <Step key={label}>
                <StepLabel onClick={() => setActiveStep(i)}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography fontWeight={600} mb={1}>
                Overall Completion
              </Typography>
              <LinearProgress
                value={overallProgress}
                variant="determinate"
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption">
                {overallProgress}% complete
              </Typography>
            </CardContent>
          </Card>

          {autoSaveStatus && (
            <Fade in>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <CheckCircle color="success" sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="caption">{autoSaveStatus}</Typography>
              </Box>
            </Fade>
          )}

          <Box mb={5}>{getStepContent(activeStep)}</Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              fullWidth
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<Preview />}
                  onClick={handleGeneratePreview}
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
                  Download PDF
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                endIcon={<Save />}
                onClick={handleNext}
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

export default CV_Maker;
