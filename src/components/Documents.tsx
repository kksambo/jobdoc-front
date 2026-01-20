import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  IconButton,
  Paper,
  Alert,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Delete,
  Download,
  Visibility,
  Home,
  UploadFile,
  InsertDriveFile,
  PictureAsPdf,
  Description,
  Close,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

const API_BASE = "https://jobdoc-generator.onrender.com";

// Styled components
const VisuallyHiddenInput = styled("input")({
  display: "none",
});

const FileCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const PreviewIframe = styled("iframe")(({ theme }) => ({
  width: "100%",
  height: "80vh",
  border: "none",
  borderRadius: theme.spacing(1),
}));

const SupportingDocumentsPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFiles(data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Icons
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <PictureAsPdf color="error" />;
    if (["doc", "docx"].includes(ext)) return <Description color="primary" />;
    return <InsertDriveFile color="action" />;
  };

  const getFileColor = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return "error";
    if (["doc", "docx"].includes(ext)) return "primary";
    return "default";
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      await new Promise((resolve, reject) => {
        xhr.open("POST", `${API_BASE}/documents/upload`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject());
        xhr.onerror = () => reject();
        xhr.send(formData);
      });

      setSelectedFile(null);
      setUploadProgress(0);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      await fetch(
        `${API_BASE}/documents/delete/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  // Download
  const handleDownload = async (filename) => {
    try {
      const res = await fetch(
        `${API_BASE}/documents/download/${encodeURIComponent(filename)}?token=${token}`,
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Download failed");
    }
  };

  // Preview
  const handlePreview = (filename) => {
    setPreviewLoading(true);
    setPreviewFile(
      `${API_BASE}/documents/download/${encodeURIComponent(filename)}?token=${token}`,
    );
    setPreviewLoading(false);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
    setPreviewLoading(false);
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Chip label="📄" color="secondary" /> Supporting Documents
          </Typography>
          <Button
            component={Link}
            to="/home"
            variant="outlined"
            color="inherit"
            startIcon={<Home />}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Upload Section */}
        <Paper
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={3}>
            Upload New Document
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            alignItems="center"
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFile />}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Choose File
              <VisuallyHiddenInput
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>

            {selectedFile && (
              <Chip
                label={selectedFile.name}
                icon={getFileIcon(selectedFile.name)}
                color={getFileColor(selectedFile.name)}
                variant="outlined"
                sx={{ maxWidth: "100%" }}
              />
            )}

            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {uploading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload"
              )}
            </Button>
          </Box>

          {uploading && (
            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ borderRadius: 1 }}
              />
              <Typography variant="caption">
                {uploadProgress}% uploaded
              </Typography>
            </Box>
          )}
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* File Grid */}
        <Grid container spacing={4}>
          {files.length === 0 && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  border: 2,
                  borderColor: "divider",
                }}
              >
                <InsertDriveFile
                  sx={{ fontSize: 60, color: "action.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  No documents uploaded yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your first document using the form above
                </Typography>
              </Paper>
            </Grid>
          )}

          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file}>
              <FileCard>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getFileIcon(file)}
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {file}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(file)}
                    color="primary"
                  >
                    View
                  </Button>
                  <Button
                    startIcon={<Download />}
                    onClick={() => handleDownload(file)}
                    color="primary"
                  >
                    Download
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(file)}
                    sx={{ ml: "auto" }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </FileCard>
            </Grid>
          ))}
        </Grid>

        {/* Preview Modal */}
        <Dialog
          open={!!previewFile}
          onClose={handleClosePreview}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            Document Preview
            <IconButton onClick={handleClosePreview}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {previewLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="60vh"
              >
                <CircularProgress />
              </Box>
            ) : (
              <PreviewIframe src={previewFile} />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default SupportingDocumentsPage;
