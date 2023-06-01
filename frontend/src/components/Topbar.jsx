import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/auth';
import { Button, Typography, Grid, AppBar, Toolbar, Menu, MenuItem, Snackbar, Box } from "@mui/material";

function Topbar() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
	const navigate = useNavigate();

  const authLinks = (
    <Box sx={{ ml: 'auto' }}>
      <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
    </Box>
  );

  const publicLinks = (
    <Box sx={{ ml: 'auto' }}>
      <Button color="inherit" component={Link} to="/register">Register</Button>
      <Button color="inherit" component={Link} to="/login">Login</Button>
    </Box>
  );

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Button color="inherit" onClick={() => navigate("/")}>
          <Typography variant="h4">Kos Saya</Typography>
        </Button>
        <Box sx={{flexGrow: 1 }} />
        {isAuthenticated ? authLinks : publicLinks}
        {/* </Box> */}
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
