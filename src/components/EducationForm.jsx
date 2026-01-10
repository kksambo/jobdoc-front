import React from 'react';
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';

const EducationForm = ({ data, onChange }) => {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Education
      </Typography>

      <Grid container spacing={3}>
        {/* Qualification */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Qualification"
            placeholder="Advanced Diploma in Information Technology"
            value={data.qualification || ''}
            onChange={(e) => onChange('qualification', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Institution */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Institution"
            placeholder="Tshwane University of Technology"
            value={data.institution || ''}
            onChange={(e) => onChange('institution', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Graduation Year */}
        <Grid item xs={12} sm={6}>
<TextField
  fullWidth
  label="Graduation Year"
  placeholder="2024"
  value={data.graduation_year || ''}
  onChange={(e) => onChange('graduation_year', e.target.value)}
  type="text"
  inputProps={{
    maxLength: 4,
    inputMode: 'numeric'
  }}
  variant="outlined"
/>
        </Grid>
      </Grid>

      {/* CV Tip */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: 'background.default',
          borderRadius: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Only include your highest or most relevant qualification for a clean, professional CV.
        </Typography>
      </Box>
    </Paper>
  );
};

export default EducationForm;
