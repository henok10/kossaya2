// import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Grid, Button, CircularProgress} from '@mui/material';
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";


export default function DataTableUser() {
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
					`http://127.0.0.1:8000/api/transaction/${params.id}/user`
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

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`http://127.0.0.1:8000/api/transaction/${id}/delete`);
  
      setAllKos(prevState => {
        const index = prevState.findIndex(kos => kos.id === id);
        if (index >= 0) {
          const updatedKos = [...prevState];
          // updatedKos.splice(index, 1);
          return updatedKos;
        } else {
          return prevState;
        }
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }


  const columns = [
    { field: 'fullName', headerName: 'Name', width: 290,},   
    { field: 'phoneNumber', headerName: 'No. Telp', width: 220 },
    { field: 'rentalFrequency', headerName: 'Frequensi Sewa', width: 150 },
    { field: 'date', headerName: 'Date', width: 250 },
    {
        field: 'barang_dibeli',
        headerName: 'Aksi',
        width: 150,
        renderCell: (params) => {
  
            return (
              <div>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  style={{ backgroundColor: 'red', color: 'white', marginLeft: '0.2rem' }}
                  onClick={() => handleDelete(params.id)}
                >
                  Hapus
                </Button>
              </div>
            );
          
      },
    }
  ];
  return (
    <>
    <Grid height={'100vh'}>
      <Grid marginTop={'2rem'}>
        <Button 
          color='success' 
          variant='contained'  
          onClick={() => navigate("/datakos")
                            }>
          Pilih Kos
        </Button>
      </Grid>
      <Grid style={{ height: '75vh', width: '100%', marginTop:'2rem' }}>
        <DataGrid
          rows={allKos}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </Grid>
    </Grid>   
    </>    
  );
}
