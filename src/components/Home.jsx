import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Grid,
  Card,
  Fade,
  Chip,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const slides = [
    {
      title: "Create CVs That Get You Hired",
      subtitle: "Professional, modern, and ATS-friendly CVs in minutes",
      bgColor: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    },
    {
      title: "Tailored Cover Letters",
      subtitle: "Custom letters for every application",
      bgColor: "linear-gradient(135deg, #1565c0 0%, #64b5f6 100%)",
    },
    {
      title: "Organize Your Job Applications",
      subtitle: "Keep all your documents and applications in one place",
      bgColor: "linear-gradient(135deg, #0d47a1 0%, #90caf9 100%)",
    },
  ];

  const features = [
    {
      icon: "📄",
      title: "CV Builder",
      desc: "Build professional CVs fast",
      link: "/cv-builder",
    },
    {
      icon: "✉️",
      title: "Cover Letters",
      desc: "Create tailored cover letters",
      link: "/cover-letters",
    },
    {
      icon: "🤖",
      title: "ATS Templates",
      desc: "Optimized for ATS systems",
      link: "/cv-builder/templates",
    },
    {
      icon: "📂",
      title: "Document Storage",
      desc: "Organize all job documents",
      link: "/documents",
    },
    {
      icon: "📊",
      title: "Application Tracker",
      desc: "Track applications easily",
      link: "/applications",
    },
    {
      icon: "🌍",
      title: "Global Jobs",
      desc: "Apply anywhere in the world",
      link: "/jobs",
    },
  ];

  const menuItems = [
    { text: "Home", link: "/" },
    { text: "CVs", link: "/cv-builder" },
    { text: "Letters", link: "/cover-letters" },
    { text: "Docs", link: "/documents" },
    { text: "Track", link: "/applications" },
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      5000,
    );
    return () => clearInterval(interval);
  }, [slides.length]);

  const bubbles = Array.from({ length: 25 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 50 + 20}px`,
    duration: `${Math.random() * 25 + 10}s`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <Box>
      {/* ===== NAVBAR ===== */}
      {/* ===== NAVBAR ===== */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(25, 118, 210, 0.95)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Brand */}
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            CareerCraft
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.link}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                }}
              >
                {item.text}
              </Button>
            ))}

            <Button
              onClick={handleLogout}
              variant="text"
              color="inherit"
              sx={{ textTransform: "none", opacity: 0.8 }}
            >
              Logout
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            sx={{ display: { md: "none" } }}
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ===== MOBILE DRAWER ===== */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <Box sx={{ width: 260, p: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            CareerCraft
          </Typography>

          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.link}
                onClick={() => setIsMenuOpen(false)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}

            <ListItem
              button
              component={RouterLink}
              to="/cv-builder"
              onClick={() => setIsMenuOpen(false)}
            >
              <ListItemText primary="Create CV" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* ===== HERO ===== */}
      <Box
        sx={{
          height: "100vh",
          background: slides[currentSlide].bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
          px: 2,
          overflow: "hidden",
        }}
      >
        {bubbles.map((bubble, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              bottom: "-100px",
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              bgcolor: "rgba(255,255,255,0.25)",
              borderRadius: "50%",
              animation: `rise ${bubble.duration} linear infinite`,
              animationDelay: bubble.delay,
            }}
          />
        ))}

        <Fade in timeout={1200}>
          <Box>
            <Typography variant="h2" fontWeight={700} mb={2}>
              {slides[currentSlide].title}
            </Typography>
            <Typography variant="h5" mb={4}>
              {slides[currentSlide].subtitle}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={RouterLink}
                to="/cv-builder"
                variant="contained"
                color="secondary"
                size="large"
              >
                Get Started
              </Button>
              <Button
                component={RouterLink}
                to="/cv-builder/templates"
                variant="outlined"
                color="inherit"
                size="large"
              >
                View Templates
              </Button>
            </Box>
          </Box>
        </Fade>

        <style>
          {`
            @keyframes rise {
              0% { transform: translateY(0); opacity: 0.5; }
              50% { opacity: 0.8; }
              100% { transform: translateY(-120vh); opacity: 0; }
            }
          `}
        </style>
      </Box>

      {/* ===== FEATURES ===== */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" align="center" mb={2} fontWeight={700}>
          Why CareerCraft?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          mb={6}
          color="text.secondary"
        >
          Everything you need to land your dream job
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                component={RouterLink}
                to={feature.link}
                sx={{
                  textDecoration: "none",
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 8,
                    bgcolor: "primary.light",
                  },
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                <Typography variant="h2">{feature.icon}</Typography>
                <Typography variant="h6" mt={2} mb={1} fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography align="center">{feature.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ===== CTA ===== */}
      <Box
        sx={{
          py: 12,
          textAlign: "center",
          background: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h4" mb={2} fontWeight={700}>
          Ready to Land Your Next Job?
        </Typography>
        <Typography variant="h6" mb={4}>
          Build your CV and cover letter today — free to start
        </Typography>
        <Button
          component={RouterLink}
          to="/cv-builder"
          variant="contained"
          color="secondary"
          size="large"
        >
          Start Building
        </Button>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box
        sx={{
          py: 6,
          bgcolor: "primary.dark",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography>© 2026 CareerCraft. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Home;
