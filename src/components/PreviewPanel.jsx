import React from 'react';
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Refresh, VisibilityOff } from '@mui/icons-material';

const PreviewPanel = ({ html }) => {
  const iframeRef = React.useRef(null);

  const handleRefreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Live Preview
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={handleRefreshPreview}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {html ? (
        <Box sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          height: '600px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="CV Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            sandbox="allow-same-origin"
          />
        </Box>
      ) : (
        <Box sx={{
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          borderRadius: 1
        }}>
          <VisibilityOff sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Preview Not Generated
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Click the "Preview" button to generate a live preview of your CV
          </Typography>
          <Alert severity="info" sx={{ mt: 2, maxWidth: 400 }}>
            The preview shows exactly how your CV will look when downloaded as PDF
          </Alert>
        </Box>
      )}
    </Paper>
  );
};

export default PreviewPanel;