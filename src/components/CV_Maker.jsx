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
    const fetchTemplates = async () => {
      try {
        const res = await fetch(
          "https://jobdoc-generator.onrender.com/api/cv/templates"
        );
        const data = await res.json();
        setTemplatesList(data.templates || []);
        if (data.templates?.length) {
          setTemplate(data.templates[0]);
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
    const filled = fields.filter((f) => {
      const v = data[f];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
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

  const handleGeneratePreview = async () => {
    if (!template) return;

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
      const res = await fetch(
        "https://jobdoc-generator.onrender.com/api/cv/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template, cv: cvData }),
        }
      );
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 } }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(#fff, #fafafa)",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Chip
            icon={<AutoAwesome />}
            label="Smart CV Builder"
            color="primary"
          />
          <Typography
            fontWeight={700}
            sx={{
              mt: 1,
              fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
            }}
          >
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

        {/* Desktop Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 4, display: { xs: "none", sm: "flex" } }}
        >
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel
                onClick={() => setActiveStep(i)}
                sx={{ cursor: "pointer" }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Mobile Step Indicator */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Chip
            label={`Step ${activeStep + 1} of ${steps.length}: ${
              steps[activeStep]
            }`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Progress */}
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

        {/* Auto Save */}
        {autoSaveStatus && (
          <Fade in>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <CheckCircle color="success" sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="caption">{autoSaveStatus}</Typography>
            </Box>
          </Fade>
        )}

        {/* Form Content */}
        <Box mb={5}>{getStepContent(activeStep)}</Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            position: { xs: "sticky", sm: "static" },
            bottom: 0,
            backgroundColor: "background.paper",
            py: 2,
          }}
        >
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CV_Maker;
