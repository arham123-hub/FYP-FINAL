import React, { useState } from 'react';
import { AppBar, Toolbar, Container, Grid, TextField, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setToken, setRole, logout } from '../state/index';

const LoginContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
}));

const LoginForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: '#FFFFFF', // White background color
}));

const LightGreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#009688', // Light green button color
  '&:hover': {
    backgroundColor: '#00796B', // Slightly darker green color on hover
  },
  borderRadius: '50px', // Make the border more circular
}));

const LightGreenHeading = styled(Typography)(({ theme }) => ({
  color: '#009688', // Light green color for the heading
  fontWeight: 'bold', // Bold font weight
}));

const LightGreenIcon = styled(PersonIcon)(({ theme }) => ({
  color: '#009688', // Light green color for the icon
}));

const LockIcon = styled(LockOutlinedIcon)(({ theme }) => ({
  color: '#009688', // Light green color for the icon
}));

const DarkGreenTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#009688', // Dark green border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#009688', // Dark green border color when focused
    },
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#009688', // Dark green border color when focused
  },
  '& .MuiFormLabel-root': {
    color: '#009688', // Light green color for the subheading above the fields
  },
}));

const DarkGreenAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#009688', // Dark green background color for the navbar
}));

const DarkGreenToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'center', // Center align items in the toolbar
}));




//login component

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var image = require('./HBL.jpg');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      toast.success("Login successful");
      console.log("Login successful:", response.data);

      
      // Extract user, token, and role from the response data
    const { user, token } = response.data;
    const role = user.role; // Assuming user.role contains the role information

    // Dispatch actions to update the Redux store
    dispatch(setUser(user));
    dispatch(setToken(token));
    dispatch(setRole(role));

      // Navigate to the homepage after successful login
      navigate('/AdminHome');
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Login error:", error);
    }
  };

  const handleForgotPasswordClick = () => {
    // Navigate to the Forgot Password screen when the user clicks on "Forgot password?"
    navigate('/forgot-password');
  };

  return (
    <>
      <DarkGreenAppBar position="static">
        <DarkGreenToolbar>
          <Typography variant="h4" component="div">
            Habib Bank Limited
          </Typography>
        </DarkGreenToolbar>
      </DarkGreenAppBar>
      <LoginContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LoginForm onSubmit={handleSubmit}>
              <LightGreenHeading variant="h4" align="center" gutterBottom>
                HBL Reporting System
              </LightGreenHeading>
              <DarkGreenTextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                InputProps={{
                  startAdornment: (
                    <LightGreenIcon />
                  ),
                }}
              />
              <DarkGreenTextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                  startAdornment: (
                    <LockIcon />
                  ),
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={showPassword} onChange={handleShowPasswordChange} />}
                label="Show Password"
              />
              <LightGreenButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Login
              </LightGreenButton>
              <Grid container>
                <Grid item xs>
                  {/* Use onClick to call the handleForgotPasswordClick function */}
                  <Typography variant="body2" style={{ color: '#00796B', cursor: 'pointer' }} onClick={handleForgotPasswordClick}>
                    Forgot password?
                  </Typography>
                </Grid>
              </Grid>
            </LoginForm>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src={image} alt="HBL" style={{ width: '120%', height: '100%', objectFit: 'cover' }} />
          </Grid>
        </Grid>
      </LoginContainer>
    </>
  );
};

export default LoginScreen;


























