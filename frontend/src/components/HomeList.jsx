import React, { useState, useEffect } from 'react';
import Axios from 'axios';
// import MUI
import {
     Grid, CircularProgress, Box
  } from "@mui/material";
import Listing from './HomeListing';
import HomeImg from './HomeImg';



function HouseList() {
  const [allListings, setAllListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
      const source = Axios.CancelToken.source();
      async function GetAllListings() {
        try {
          const response = await Axios.get(
            "http://127.0.0.1:8000/api/listings/",
            { cancelToken: source.token }
          );
  
          setAllListings(response.data);
          setDataIsLoading(false);
        } catch (error) {}
      }
      GetAllListings();
      return () => {
        source.cancel();
      };
    }, []);

    useEffect(() => {
      const filteredData = allListings.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.listing_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredData);
    }, [searchTerm, allListings]);
  
    if (dataIsLoading === true) {
      return (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <CircularProgress />
        </Grid>
      );
    }
  return (
    <>
      <HomeImg searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Grid container width='60%' margin={'auto'}> 
        <Grid item xs={12}>
          <Grid container spacing={1} marginTop='2rem'>
            <Box textAlign='center'>
              <h1>Recent Rumah Kos Listed</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
            </Box>
            <Listing filtered={searchResults} isLoading={dataIsLoading} />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default HouseList