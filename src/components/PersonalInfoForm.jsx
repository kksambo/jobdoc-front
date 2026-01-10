import React from 'react';
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { PhotoCamera, Person } from '@mui/icons-material';

const PersonalInfoForm = ({ data, onChange }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4
      }}
    >
      {/* Header */}
      <Box mb={3}>
        <Chip
          icon={<Person />}
          label="Personal Information"
          color="primary"
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          This information appears at the top of your CV
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Top Section: Photo + Key Info */}
      <Grid container spacing={4} alignItems="center">
        {/* Profile Photo */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Avatar
              src={data.photo || ''}
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'grey.200',
                fontSize: 40,
                mb: 2
              }}
            />

            <Typography fontWeight={600}>
              Profile Photo
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Optional but recommended
            </Typography>

            <IconButton
              color="primary"
              component="label"
              sx={{
                border: '1px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                px: 2
              }}
            >
              <PhotoCamera />
              <Typography variant="body2" ml={1}>
                Upload
              </Typography>
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onChange('photo', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </IconButton>
          </Box>
        </Grid>

        {/* Name & Title */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={data.full_name || ''}
                onChange={(e) => onChange('full_name', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={data.job_title || ''}
                onChange={(e) => onChange('job_title', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Contact Details */}
      <Box mt={5}>
        <Typography fontWeight={600} mb={2}>
          Contact Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={data.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={data.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </Box>

      {/* Professional Summary */}
      <Box mt={5}>
        <Typography fontWeight={600} mb={2}>
          Professional Summary
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Summary"
          value={data.profile_summary || ''}
          onChange={(e) => onChange('profile_summary', e.target.value)}
          placeholder="Brief overview of your experience, skills, and career goals..."
          helperText="Tip: 2–4 concise lines highlighting your strengths"
        />
      </Box>
    </Paper>
  );
};

export default PersonalInfoForm;
