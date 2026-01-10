import React, { useState } from 'react';
import {
  TextField,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  Divider
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const updatedSkills = [...(data.skills || []), newSkill.trim()];
    onChange('skills', updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...data.skills];
    updatedSkills.splice(index, 1);
    onChange('skills', updatedSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4
      }}
    >
      {/* Header */}
      <Box mb={2}>
        <Typography variant="h6" color="primary">
          Skills
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add skills that are relevant to the role you’re applying for
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Add Skill */}
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            label="Add a skill"
            placeholder="e.g. Java, Spring Boot, SQL"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      {/* Skills List */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Your Skills ({data.skills?.length || 0})
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.skills?.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleRemoveSkill(index)}
              deleteIcon={<Close />}
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 500,
                '& .MuiChip-deleteIcon': {
                  color: 'error.main'
                }
              }}
            />
          ))}

          {(!data.skills || data.skills.length === 0) && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              No skills added yet
            </Typography>
          )}
        </Box>
      </Box>

      {/* Tip */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Focus on skills mentioned in the job description to improve ATS matching.
        </Typography>
      </Box>
    </Paper>
  );
};

export default SkillsForm;
