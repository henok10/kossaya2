import React from 'react';

import { useNavigate } from "react-router-dom";
// import MUI
import {
    Box, Button,Typography, Grid, Card, CardMedia, CircularProgress, CardActions,CardContent,  CardHeader, IconButton
  } from "@mui/material";
import { makeStyles } from "@mui/styles";
import RoomIcon from "@mui/icons-material/Room";

  const useStyles = makeStyles(()=> ({

    cardStyle: {
      marginTop: "0.5rem",
      marginLeft: "0.5rem",
  
      border: "4px solid white",
      position: "relative",
      height: "21rem",
    },
  
    pictureStyle: {
      paddingRight: "1rem",
      paddingLeft: "1rem",
      height: "8rem",
      cursor: "pointer",
    },
    priceOverlay: {
      position: "absolute",
      backgroundColor: "green",
      zIndex: "1",
      color: "white",
      top: "70px",
      left: "20px",
      padding: "5px",
      textAlign: "justify",
      
    },
    priceLabel: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: 'skyblue',
      height: '2rem'

    },
    typeLabel: {

    }
  }));
export default function Listing({ filtered, isLoading }) {
    const classes = useStyles();
    const navigate = useNavigate();
    if (isLoading) {
      return (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100vh' }}
        >
          <CircularProgress />
        </Grid>
      );
    }
  return (
    <>
        {filtered.slice(0, 9).map((listing) => {
        return(
            <Grid item xs={12} sm={6} md={4}>
                <Card key={listing.id} className={classes.cardStyle} >
                    <CardMedia
                    // className={classes.pictureStyle}
                    component="img"
                    height="160"
                    image={listing.picture1}
                    alt={listing.title}
                    onClick={() => navigate(`/listings/${listing.id}`)}
                    />
                    <CardHeader
                      title={
                        <Typography gutterBottom variant="h6" style={{ fontSize: "18px" }}>
                          {listing.title.substring(0, 36)}
                        </Typography>
                      }
                    />
                    <CardContent style={{ marginTop: '-35px'}}>
                      <Typography gutterBottom variant="body4" component="div" style={{ fontSize: "10px" }}>
                        {listing.address.substring(0, 100)}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ position: 'absolute', bottom: '0', width: '100%' }}>
                      <Box width='100%' style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography className={classes.priceLabel} component="span">
                          Rp{listing.price_per_year}/year
                          </Typography>     
                          <Button variant="contained" color="primary" size='small' onClick={() => navigate(`/listings/${listing.id}`)}>
                            Details
                          </Button>
                      </Box>
                    </CardActions>

                </Card>
            </Grid>
        );
        })}
    </>
  );
}
