import React from 'react';
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const ExperienceForm = ({ data, onChange }) => {
  const handleAddDuty = () => {
    const newDuties = [...(data.duties || []), ''];
    onChange('duties', newDuties);
  };

  const handleUpdateDuty = (index, value) => {
    const newDuties = [...(data.duties || [])];
    newDuties[index] = value;
    onChange('duties', newDuties);
  };

  const handleRemoveDuty = (index) => {
    const newDuties = [...(data.duties || [])];
    newDuties.splice(index, 1);
    onChange('duties', newDuties);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Work Experience
      </Typography>

      <Grid container spacing={3}>
        {/* Role */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Role / Position"
            value={data.role || ''}
            onChange={(e) => onChange('role', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Company */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company Name"
            value={data.company_name || ''}
            onChange={(e) => onChange('company_name', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Dates */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Date"
            value={data.start_date || ''}
            onChange={(e) => onChange('start_date', e.target.value)}
            placeholder="Jan 2024"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Date"
            value={data.end_date || ''}
            onChange={(e) => onChange('end_date', e.target.value)}
            placeholder="Dec 2024 or Present"
            variant="outlined"
          />
        </Grid>

        {/* Duties / Accomplishments */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography variant="subtitle1">
              Duties & Accomplishments
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={handleAddDuty}
              variant="outlined"
              size="small"
            >
              Add Duty
            </Button>
          </Box>

          <List>
            {(data.duties || []).map((duty, index) => (
              <ListItem key={index} divider>
                <ListItemText>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={duty}
                    onChange={(e) =>
                      handleUpdateDuty(index, e.target.value)
                    }
                    placeholder="Describe your duty or achievement..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                  />
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveDuty(index)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExperienceForm;
