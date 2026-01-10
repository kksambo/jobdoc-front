import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  Fade,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Download,
  Preview,
  Save,
  CheckCircle,
  AutoAwesome,
} from "@mui/icons-material";

import PersonalInfoForm from "./PersonalInfoForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import PreviewPanel from "./PreviewPanel";

const steps = ["Personal Info", "Experience", "Education", "Skills", "Preview"];
const LOCAL_STORAGE_KEY = "cvData";

const CV_Maker = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
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
        };
  });

  const [template, setTemplate] = useState("");
  const [templatesList, setTemplatesList] = useState([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

  useEffect(() => {
    // Fetch available templates from FastAPI
    const fetchTemplates = async () => {
      try {
        const res = await fetch(
          "https://jobdoc-generator.onrender.com/api/cv/templates"
        );
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplatesList(data.templates || []);
        if (data.templates && data.templates.length > 0) {
          setTemplate(data.templates[0]); // default to first template
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  const handleInputChange = (field, value) => {
    const newData = { ...cvData, [field]: value };
    setCvData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    setAutoSaveStatus("Saving...");
    setTimeout(() => setAutoSaveStatus("Saved"), 900);
  };

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
    const filled = fields.filter((field) => {
      const value = data[field];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const overallProgress = Math.round(
    Object.values(sectionConfig).reduce(
      (acc, fields) => acc + getSectionProgress(fields, cvData),
      0
    ) / Object.values(sectionConfig).length
  );

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

  // Generate Preview
  const handleGeneratePreview = async () => {
    if (!template) {
      setSnackbar({
        open: true,
        message: "Please select a template first",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://jobdoc-generator.onrender.com/api/cv/preview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template, cv: cvData }),
        }
      );

      if (!res.ok) throw new Error("Failed to generate preview");

      const html = await res.text();
      setPreviewHtml(html);
      setActiveStep(4);
      setSnackbar({
        open: true,
        message: "Preview Generated",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to generate preview",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!template) return;

    try {
      setLoading(true);
      const res = await fetch(
        "https://jobdoc-generator.onrender.com/api/cv/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template, cv: cvData }),
        }
      );

      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "My_CV.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSnackbar({
        open: true,
        message: "PDF Downloaded",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to download PDF",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(#ffffff, #fafafa)",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Chip
            icon={<AutoAwesome />}
            label="Smart CV Builder"
            color="primary"
            sx={{ mb: 1 }}
          />
          <Typography variant="h3" fontWeight={700}>
            Professional CV Maker
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Build a job-ready CV with clean design and perfect structure
          </Typography>

          {/* Template Selector */}
          <Box mt={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Choose Template</InputLabel>
              <Select
                value={template}
                label="Choose Template"
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

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 6, "& .MuiStepLabel-label": { fontWeight: 500 } }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => setActiveStep(index)}
                sx={{
                  cursor: "pointer", // show pointer on hover
                  "& .MuiStepLabel-label": { fontWeight: 500 },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Section Progress */}
        <Card sx={{ mb: 6, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Section Completion
            </Typography>
            <Grid container spacing={3}>
              {[
                { key: "personal", label: "Personal Info" },
                { key: "experience", label: "Experience" },
                { key: "education", label: "Education" },
                { key: "skills", label: "Skills" },
              ].map((section) => {
                const progress = getSectionProgress(
                  sectionConfig[section.key],
                  cvData
                );
                return (
                  <Grid item xs={12} sm={6} key={section.key}>
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={0.5}
                      >
                        <Typography fontWeight={600}>
                          {section.label}
                        </Typography>
                        <Chip
                          size="small"
                          color={progress === 100 ? "success" : "default"}
                          label={
                            progress === 100 ? "Completed" : `${progress}%`
                          }
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": { borderRadius: 5 },
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Overall Progress */}
            <Box mt={4}>
              <Typography fontWeight={600} mb={1}>
                Overall CV Completion
              </Typography>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                sx={{
                  height: 14,
                  borderRadius: 7,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { borderRadius: 7 },
                }}
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                {overallProgress}% complete
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Auto Save */}
        {autoSaveStatus && (
          <Fade in>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <CheckCircle color="success" sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="caption">{autoSaveStatus}</Typography>
            </Box>
          </Fade>
        )}

        {/* Content */}
        <Box mb={5}>{getStepContent(activeStep)}</Box>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Box>
              <Button
                variant="contained"
                startIcon={<Preview />}
                onClick={handleGeneratePreview}
                sx={{ mr: 2, borderRadius: 3 }}
                disabled={loading}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Download />}
                onClick={handleDownloadPDF}
                sx={{ borderRadius: 3 }}
                disabled={loading || !previewHtml}
              >
                Download PDF
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              endIcon={<Save />}
              onClick={handleNext}
              sx={{ borderRadius: 3 }}
            >
              Save & Continue
            </Button>
          )}
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CV_Maker;
