import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Divider,
  Grid
} from "@mui/material";

import SkillsInput from "./SkillsInput";
import DutiesInput from "./DutiesInput";

export default function CVForm({ data, setData }) {
  const update = (key, value) =>
    setData({ ...data, [key]: value });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Input label="Full Name" value={data.full_name} onChange={v => update("full_name", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Job Title" value={data.job_title} onChange={v => update("job_title", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Email Address" value={data.email} onChange={v => update("email", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Phone Number" value={data.phone} onChange={v => update("phone", v)} />
          </Grid>
          <Grid item xs={12}>
            <Input label="Location" value={data.location} onChange={v => update("location", v)} />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              label="Profile Summary"
              helper="Brief professional summary (2–4 lines)"
              value={data.profile_summary}
              onChange={v => update("profile_summary", v)}
            />
          </Grid>
        </Grid>
      </Section>

      {/* EXPERIENCE */}
      <Section title="Work Experience">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Input label="Role / Position" value={data.role} onChange={v => update("role", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Company Name" value={data.company_name} onChange={v => update("company_name", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Start Date" value={data.start_date} onChange={v => update("start_date", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="End Date" value={data.end_date} onChange={v => update("end_date", v)} />
          </Grid>

          <Grid item xs={12}>
            <Textarea label="Responsibility / Achievement 1" value={data.responsibility_1} onChange={v => update("responsibility_1", v)} />
          </Grid>
          <Grid item xs={12}>
            <Textarea label="Responsibility / Achievement 2" value={data.responsibility_2} onChange={v => update("responsibility_2", v)} />
          </Grid>
          <Grid item xs={12}>
            <Textarea label="Responsibility / Achievement 3" value={data.responsibility_3} onChange={v => update("responsibility_3", v)} />
          </Grid>
        </Grid>
      </Section>

      {/* EDUCATION */}
      <Section title="Education">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Input label="Qualification" value={data.qualification} onChange={v => update("qualification", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Institution" value={data.institution} onChange={v => update("institution", v)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="Graduation Year" value={data.graduation_year} onChange={v => update("graduation_year", v)} />
          </Grid>
        </Grid>
      </Section>

      {/* SKILLS */}
      <Section title="Skills">
        <SkillsInput skills={data.skills} onChange={v => update("skills", v)} />
      </Section>

      {/* DUTIES */}
      <Section title="Additional Duties">
        <DutiesInput duties={data.duties} onChange={v => update("duties", v)} />
      </Section>
    </Box>
  );
}

/* ---------------- Reusable UI Components ---------------- */

function Section({ title, children }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
}

function Input({ label, value, onChange }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      variant="outlined"
    />
  );
}

function Textarea({ label, value, onChange, helper }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      multiline
      minRows={3}
      helperText={helper}
      variant="outlined"
    />
  );
}
