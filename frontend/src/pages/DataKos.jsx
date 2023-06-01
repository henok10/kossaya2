// import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Grid, Box, Button, CircularProgress} from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';


export default function DataTable() {
  const userId = useSelector(state => state.auth.userId)
  const ownerId = useSelector(state => state.auth.ownerId)
	const navigate = useNavigate();
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isCustomer = useSelector((state) => state.auth.isCustomer);
	const isOwner = useSelector((state) => state.auth.isOwner);
  const [allKos, setAllKos] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const params = useParams();
  const [listingIds, setListingIds] = useState([]);

	useEffect(() => {
		if (!isAuthenticated) {
		  navigate("/login");
		}
	  }, [isAuthenticated, navigate]);
	
	  useEffect(() => {
		if (isCustomer) {
		  navigate("/profileCustomer");
		}
	  }, [isOwner, navigate]);


	// request to get profile info
	useEffect(() => {
    const source = Axios.CancelToken.source();
		async function GetAllKos() {
			try {
				const response = await Axios.get(
					`http://127.0.0.1:8000/api/listings/${ownerId}/list`
				);
        const data = response.data;
        const listingIds = data.map(listing => parseInt(listing.id));
        setAllKos(data);
        setListingIds(listingIds);
        setDataIsLoading(false);
        
      } catch (error) {}
    }
    GetAllKos();
    return () => {
      source.cancel();
    };
  }, [userId]);
  const [numItemsBoughtByListingId, setNumItemsBoughtByListingId] = useState({});
  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetTransaksiKos() {
      try {
        const numItemsBoughtByListingId = {};
        for (const listingId of listingIds) {
          console.log(listingId)
          const response = await Axios.get(`http://127.0.0.1:8000/api/transaction/${listingId}/user`);
          const data = response.data;
          const numItemsBought = data.filter(transaksi => transaksi.barang_dibeli).length;
          numItemsBoughtByListingId[listingId] = numItemsBought;
         
        }
        setNumItemsBoughtByListingId(numItemsBoughtByListingId);
        setDataIsLoading(false);
      } catch (error) {}
    }   
    GetTransaksiKos();
    return () => {
      source.cancel();
    };
  }, [listingIds]);
  
  

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

  const columns = [
    { 
      field: 'title', 
      headerName: 'Name', 
      width: 250,
      renderCell: (params) => (
        <Link to={`/listingsOwner/${params.row.id}`}>{params.value}</Link>
      ),
    },
    { 
      field: 'address', 
      headerName: 'Alamat', 
      width: 290 
    },
    { 
      field: 'rooms', 
      headerName: 'Rooms', 
      width: 100 
    },
    { 
      field: 'available_rooms', 
      headerName: 'Rooms Kosong', 
      width: 120, 
      renderCell: (params) => {
        const numItemsBoughts = numItemsBoughtByListingId[params.row.id];
        return(
          <div>{params.row.rooms - numItemsBoughts}</div>
        )  
      }
      
    },
    { 
      field: 'borough', 
      headerName: 'Borough', 
      width: 150 
    },
    {
      field: 'Kunjungi',
      headerName: 'Data Pengguna',
      width: 150,
      renderCell: (params) => (
        <Link to={`/datakosApprove/${params.row.id}`}>
          <Button variant="contained" color="primary">
            Lihat
          </Button>
        </Link>
      ),
    }
  ];
  
  return (
    <>
   <Grid container style={{ width: '100%', height: '60%', marginLeft: '3rem'}}>
    <Grid item xs={12} style={{ marginTop: '2rem' }}>
      <Button 
        color='success' 
        variant='contained'  
        onClick={() => navigate("/listingadd")}
      >
        Tambahkan Kos
      </Button>
    </Grid>
    <div style={{ height: 480, marginTop:'2rem', width: '95%'}}>
      <DataGrid
        rows={allKos}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  </Grid>

    
    </>
    
  );
}
