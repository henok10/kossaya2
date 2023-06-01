
import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid,
	Typography,
    Box,
	TextField,
    Button,
    MenuItem,
    Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const useStyles = makeStyles({
  formContainer: {
		width: "80%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "1rem",
		border: "5px solid lightWhite",
		padding: "3rem",
	},
	loginBtn: {
		backgroundColor: "green",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
		"&:hover": {
			backgroundColor: "blue",
		},
	},
});
function Order() {
    const classes = useStyles();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isCustomer = useSelector((state) => state.auth.isCustomer);
    const userId = useSelector(state => state.auth.userId)
    const customerId = useSelector(state => state.auth.customerId)
    const params = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isCustomer) {
      navigate("/");
    }
  }, [isCustomer, navigate]);

  const initialState = {
    fullNameValue: "",
    phoneNumberValue: "",
    rentalFrequencyValue: "",
    buktiTransferValue: "",
    uploadedPicture: [],
    barangDipesanValue: true,
    openSnack: false,
  }
  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);
  // Use effect to cath uplaoded picture

  function ReducerFuction(draft, action) {
    switch (action.type) {
        case "catchUserOrderInfo":
            draft[action.name] = action.value;
        break;

        case "catchOrderInfo":
            draft.buktiTransferValue = action.profileOrder.buktiTransfer
            break;
        case "catchUploadedPicture":
            draft.uploadedPicture = action.pictureChosen;
            break;
  
        case "catchProfilePictureChange":
            draft.buktiTransferValue = action.buktiTransferChosen;
        break;

        case "openTheSnack":
          draft.openSnack = true;
          break;
  
        case "sendRequest":
            draft.sendRequest = true;
            break;
        case "requestSent":
            draft.sendRequest = false;
            break;
        default:
            return draft;
    }
}

    useEffect(() => {
      if (state.uploadedPicture[0]) {
        dispatch({
          type: "catchProfilePictureChange",
          buktiTransferChosen: state.uploadedPicture[0],
        });
      }
    }, [state.uploadedPicture[0]]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        dispatch({ type: "catchUserOrderInfo", name, value });
    }, [dispatch]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        dispatch({ type: "sendRequest" });
  
      const formData = new FormData();
      formData.append("fullName", state.fullNameValue);
      formData.append("phoneNumber", state.phoneNumberValue);
      formData.append("rentalFrequency", state.rentalFrequencyValue);
      formData.append("barang_dipesan", state.barangDipesanValue);
      formData.append("buktiTransfer", state.buktiTransferValue);
      formData.append("listing", params.id);
      formData.append("customer", customerId);
  
      try {
        const response = await Axios.post(
          `http://127.0.0.1:8000/api/transaction/create`,
          formData
        );
        console.log(response.data);
        dispatch({ type: "openTheSnack" });
      } catch (error) {
        console.error(error);
        dispatch({ type: "requestSent" });
      }
    }, [dispatch, state.fullNameValue, state.phoneNumberValue, state.rentalFrequencyValue, state.barangDipesanValue, state.buktiTransferValue, params.id, userId]);
    
    useEffect(() => {
      if (state.openSnack) {
        setTimeout(() => {
          navigate(`/listings/${params.id}`);
        }, 1500);
      }
    }, [state.openSnack]);
return (
    <>
      <Box width="50%" height="100%" margin="auto" backgroundColor="white">
        <div container>
          <Typography style={{textAlign: "center"}}>
            <h1>Pesan Kamar</h1>
          </Typography>
        </div>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            <Grid item container style={{ marginTop: "1rem" }}>
              <TextField
                id="username"
                label="Nama Penyewa"
                variant="outlined"
                fullWidth
                value={state.fullNameValue}
                onChange={handleChange}
                name="fullNameValue"
              />
            </Grid>
            <Grid item container style={{ marginTop: "1rem" }}>
              <TextField
                id="username"
                label="No. Telp"
                variant="outlined"
                fullWidth
                value={state.phoneNumberValue}
                onChange={handleChange}
                name="phoneNumberValue" 
              />
            </Grid>
            <Grid margin="auto" marginTop="1rem">
              <TextField
                id="number"
                label="Durasi Penyewaan"
                variant="outlined"
                fullWidth
                marginTop="1rem"
                value={state.rentalFrequencyValue}
                onChange={handleChange}
                name="rentalFrequencyValue"
                select
              >
                <MenuItem value="Year">Year</MenuItem>
                <MenuItem value="Month">Month</MenuItem>
                <MenuItem value="Day">Day</MenuItem>
              </TextField>
            </Grid>

            <Grid
                item
                container
                xs={6}
                style={{
                  marginTop: "1rem",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{textAlign: 'center'}}
                >
                  UPLOAD BUKTI PEMBAYARAN
                  <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    hidden
                    onChange={(e) =>
                      dispatch({
                        type: "catchUploadedPicture",
                        pictureChosen: e.target.files,
                      })
                    }
                  />
                </Button>
                <Typography style={{marginTop:'1rem'}}>
										{state.buktiTransferValue ? <p>{state.buktiTransferValue.name}</p> : ""}
									</Typography>
					  </Grid>

            <Grid
              item
              container
              justifyContent="center"
              style={{ marginTop: "1rem" }}
            >
              <Button
                variant="contained"
                fullWidth
                className={classes.loginBtn}
                type="submit"
                disabled={state.sendRequest}
              >
                Order
              </Button>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              style={{ marginTop: "1rem" }}
              
            >
              <Typography variant="small">
                Sudah memesan?{" "}
                <span
                  onClick={() => navigate(`/riwayatTransaksi`)}
                  style={{ color: "#2F80ED", cursor: "pointer" }}
                >
                  Lihat transaksi kamu disini
                </span>
              </Typography>
            </Grid>
          </form>
          <Snackbar
            open={state.openSnack}
            message="You have successfully Order Rumah Kos!"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          />
        </div>
      </Box>
    </>
  );
  
}

export default Order