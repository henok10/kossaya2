import React, { useState } from 'react';
import { makeStyles } from "@mui/styles";
import { Box, Button, Container, Grid, TextField, Typography, Paper} from "@mui/material";
const useStyles = makeStyles(() => ({
  title: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '32px',
    margin: 'auto',
    textAlign: 'center',
    color: 'white'
  },
  subtitle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    margin: 'auto',
    textAlign: 'center',
  },
  form: {
    padding: '0',
    margin: '100px auto',
    maxWidth: '70%',
    height: '7rem',
    marginBottom: '1rem',
  },
  box: {
    margin: '10px',
  },
  label: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '10px 0',
    color: 'lightblue'
  },
  heading: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '48px',
    margin: '10px',
  },
  }));

function Search({setSearchTerm }) {
    const [terms, setTerms] = useState('');
    const classes = useStyles();
    
    return (
        <>
        <Container>
            <Box className={classes.title}>
            <Typography style={{margin: "auto", textAlign: "center" }}> 
                <Typography className={classes.heading} variant="h1">
                Search Rumah Kos
                </Typography>
                <Typography className={classes.subtitle} variant="subtitle1">
                Find new &amp; featured property located in your local city.
                </Typography>
            </Typography>
            </Box>

            <form className={classes.form} >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4.5}>
                <Box className={classes.box}>
                    <Typography className={classes.label} variant="body1">
                    City/Street
                    </Typography>
                        <Paper>
                            <TextField
                                style={{height: '50%'}}
                                id="outlined-basic"
                                label="City/Street..."
                                size="small"
                                fullWidth
                                // value={searchTerms}
                                onChange={(e) => setTerms(e.target.value)}
                            >
                            </TextField>
                        </Paper>
                </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4.5}>
                <Box className={classes.box}> 
                    <Typography className={classes.label} variant="body1">
                      Price
                    </Typography>
                    <Paper>
                        <TextField
                            style={{height: '50%'}}
                            id="outlined-basic"
                            label="Price..."
                            size="small"
                            fullWidth
                            // value={searchTerms}
                            onChange={(e) => setTerms(e.target.value)}
                        />
                    </Paper>
                </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                <Box className={classes.box}>                 
                    <Typography className={classes.label} variant="body1" style={{ textAlign: "center" }}>
                      Advanced Filter
                    </Typography>
                    <Button  
                        variant="contained" 
                        size="large" 
                        style={{ margin: "auto", display: "block" }}
                        color="primary"
                        onClick={() => setSearchTerm(terms)}
                    >
                        <i className="fa fa-search">Search</i>
                    </Button>
                </Box>
                </Grid>
            </Grid> 
            </form>
        </Container>
        </>
    )
}

export default Search