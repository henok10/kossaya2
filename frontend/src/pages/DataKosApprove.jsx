// import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Grid, Box, Button, CircularProgress} from '@mui/material';
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";


export default function DataTableApprove() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isCostumer = useSelector((state) => state.auth.isCostumer);
  const isPemilikKos = useSelector((state) => state.auth.isPemilikKos);
  const [allKos, setAllKos] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const params = useParams();

	useEffect(() => {
		if (!isAuthenticated) {
		  navigate("/login");
		}
	  }, [isAuthenticated, navigate]);
	
	  useEffect(() => {
		if (isCostumer) {
		  navigate("/profileCustomer");
		}
	  }, [isPemilikKos, navigate]);


	// request to get profile info
	useEffect(() => {
    const source = Axios.CancelToken.source();
		async function GetAllKos() {
			try {
				const response = await Axios.get(
					`http://127.0.0.1:8000/api/transaction/${params.id}/list`
				);
                
				setAllKos(response.data);
        setDataIsLoading(false);
      } catch (error) {}
    }   
    GetAllKos();
    return () => {
      source.cancel();
    };
  }, []);

  async function deleteKos(id) {
    try {
      await Axios.delete(`http://127.0.0.1:8000/api/transaction/${id}/delete`);
  
      setAllKos(prevState => {
        const index = prevState.findIndex(kos => kos.id === id);
        if (index >= 0) {
          const updatedKos = [...prevState];
          updatedKos.splice(index, 1);
          return updatedKos;
        } else {
          return prevState;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  async function updateBarangDibeli(id, newValue) {
    try {
        const response = await Axios.patch(`http://127.0.0.1:8000/api/transaction/${id}/update`, {barang_dibeli: newValue});
    
        const updatedKos = {
          ...response.data,
          barang_dibeli: newValue,
        };
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
  }

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
    { field: 'buktiTransfer', 
      headerName: 'Bukti Transfer', 
      width: 150,
      renderCell: (params) => (
        <img src={params.value} alt="product" style={{ width: '80%', height: '80%', objectFit: 'cover', margin: 'auto' }} />
      ),
    },
    { field: 'fullName', 
      headerName: 'Name', 
      width: 240,
    },
      
    { field: 'phoneNumber', headerName: 'No. Telp', width: 150 },
    { field: 'rentalFrequency', headerName: 'Frequensi Sewa', width: 150 },
    { field: 'date', headerName: 'Date', width: 180 },
    {
        field: 'barang_dibeli',
        headerName: 'Aksi',
        width: 195,
        renderCell: (params) => {
          if (params.value === true) {
            return (
              <div>
                <Button 
                  variant="contained" 
                  color="primary"
                  disabled
                >
                  Setuju
                </Button>
              </div>
            );
          } else {
            return (
              <Box style={{display: 'flex', justifyContent: 'space-between', width: '95%'}}> 
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => updateBarangDibeli(params.id, true)} 
                >
                  Setuju
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => deleteKos(params.id)}
                >
                  Tolak
                </Button>
              </Box>
            );
          }
        },
      },
      
      
  ];
  return (
    <>
    <Grid height={'60%'}>
      <Grid marginTop={'2rem'}>
        <Button 
          color='success' 
          variant='contained'  
          onClick={() => navigate("/datakos")
                            }>
          Pilih Kos
        </Button>
        <Button 
          color='success' 
          variant='contained' 
          style={{marginLeft: '0.5rem'}} 
          onClick={() => navigate(`/datakosUser/${params.id}`)
                            }>
          Penghuni Kos
        </Button>
      </Grid>
      <Grid style={{ height: 480, width: '100%', marginTop:'2rem' }}>
        <DataGrid
          rows={allKos}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          getRowHeight={() => 180}
        />
      </Grid>
    </Grid>
    
    </>
    
  );
}
